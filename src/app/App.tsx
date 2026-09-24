import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Install } from "./Install";
const DevPanel = import.meta.env.DEV ? lazy(() => import("./DevPanel")) : null;
import {
  counts,
  domains,
  type Domain,
  type Lang,
  type Mode,
  type Session,
  type Answer,
} from "../cognitive/types";
import {
  estimate,
  report,
  selectItem,
  domainAnswers,
} from "../cognitive/engine";
import { makeBank } from "../exercises/bank";
import * as db from "../storage/store";
import { labels, names, modeNames, deviceNames, domainActions } from "./i18n";
import { Neural } from "./Neural";
import { Exercise } from "./Exercise";
import { AnswerReview } from "./AnswerReview";
type Page =
  | "home"
  | "setup"
  | "demo"
  | "test"
  | "result"
  | "history"
  | "practice"
  | "method";

const pageRoutes: Record<Page, string> = {
  home: "exploration",
  setup: "preparation",
  demo: "demonstration",
  test: "analyse",
  result: "resultat",
  history: "resultats",
  practice: "entrainement",
  method: "methodologie",
};

const routePages = Object.fromEntries(
  Object.entries(pageRoutes).map(([page, route]) => [route, page]),
) as Record<string, Page>;

function pageFromHash(): Page {
  const route = location.hash.replace(/^#\/?/, "").split(/[?&]/)[0];
  return routePages[route] ?? "home";
}
function download(data: unknown, name: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function App() {
  const [lang, setLang] = useState<Lang>("fr");
  const [page, setPage] = useState<Page>(() => pageFromHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<Mode>("standard");
  const [age, setAge] = useState("25–44");
  const [device, setDevice] = useState("smartphone");
  const [recent, setRecent] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [practiceDomain, setPracticeDomain] = useState<Domain>("logic");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [demo, setDemo] = useState(0);
  const [resumed, setResumed] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [shareNotice, setShareNotice] = useState("");
  const bank = useMemo(() => makeBank(lang), [lang]);
  const t = labels[lang],
    fr = lang === "fr";
  const active = sessions.find((s) => s.status === "active");
  const sessionBank = useMemo(
    () => makeBank(session?.lang ?? lang),
    [session?.lang, lang],
  );
  const r = session ? report(session, sessionBank) : null;
  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHashChange);
    if (!location.hash) location.hash = `#/${pageRoutes.home}`;
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.lang = lang;
    document.documentElement.dataset.synaptikPage = page;
    const wantedHash = `#/${pageRoutes[page]}`;
    if (location.hash !== wantedHash) location.hash = wantedHash;
    setMenuOpen(false);
    window.dispatchEvent(new Event("synaptik-page-change"));
    const titles: Record<Page, string> = {
      home: fr ? "Exploration" : "Explore",
      setup: fr ? "Préparation" : "Preparation",
      demo: fr ? "Démonstration" : "Demonstration",
      test: fr ? "Analyse" : "Assessment",
      result: fr ? "Résultat" : "Result",
      history: fr ? "Mes résultats" : "My results",
      practice: fr ? "Entraînement" : "Practice",
      method: fr ? "Méthodologie" : "Methodology",
    };
    document.title = `SYNAPTIK TEST QI — ${titles[page]}`;
  }, [page, lang, fr]);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);
  useEffect(() => {
    db.list()
      .then((stored) => {
        setSessions(stored);
        setStorageReady(true);
      })
      .catch(() => {
        setStorageReady(true);
        setError("Stockage indisponible : autorise les données locales.");
      });
    const fn = () => setOnline(navigator.onLine);
    window.addEventListener("online", fn);
    window.addEventListener("offline", fn);
    return () => {
      window.removeEventListener("online", fn);
      window.removeEventListener("offline", fn);
    };
  }, []);
  useEffect(() => {
    const handler = () => {
      if (document.hidden && session && page === "test") {
        const next = { ...session, interruptions: session.interruptions + 1 };
        setSession(next);
        void db.save(next).catch(() => setError("Échec de sauvegarde."));
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [session, page]);
  useEffect(() => {
    if (!storageReady || session) return;
    if (page === "test") {
      const current = sessions.find((s) => s.status === "active");
      if (current) {
        setResumed(true);
        setLang(current.lang);
        setSession(current);
      } else {
        setPage("home");
      }
    }
    if (page === "result") {
      const latest = [...sessions]
        .filter((s) => s.status === "complete")
        .sort((a, b) => b.created.localeCompare(a.created))[0];
      if (latest) {
        setLang(latest.lang);
        setSession(latest);
      } else {
        setPage("history");
      }
    }
  }, [storageReady, sessions, session, page]);
  async function persist(s: Session) {
    try {
      await db.save(s);
      setSessions(await db.list());
      setError("");
      return true;
    } catch {
      setError(
        fr
          ? "Sauvegarde impossible. Garde cette page ouverte et exporte tes données."
          : "Save failed. Keep this page open and export your data.",
      );
      return false;
    }
  }
  async function start() {
    setResumed(false);
    const s: Session = {
      id: crypto.randomUUID(),
      seed: crypto.getRandomValues(new Uint32Array(1))[0],
      mode,
      lang,
      age,
      device,
      recent:
        recent ||
        sessions.some((x) => Date.now() - Date.parse(x.created) < 7 * 86400000),
      consent,
      created: new Date().toISOString(),
      answers: [],
      interruptions: 0,
      status: "active",
      testVersion: "1.3",
      calibrationStatus: "experimental",
    };
    s.currentId = selectItem(s, bank)?.id;
    setSession(s);
    await persist(s);
    setPage("test");
  }
  async function answer(a: Omit<Answer, "theta">) {
    if (!session) return;
    if (session.testVersion === "1") a = { ...a, excluded: undefined };
    setResumed(false);
    const item = bank.find((i) => i.id === a.itemId)!;
    const theta = estimate(
      [...domainAnswers(session, bank, item.domain), { ...a, theta: 0 }],
      bank,
    ).theta;
    const next: Session = {
      ...session,
      answers: [...session.answers, { ...a, theta }],
    };
    if (next.answers.length >= counts[next.mode]) {
      next.status = "complete";
      next.currentId = undefined;
    } else
      next.currentId = selectItem(
        next,
        bank,
        sessions
          .filter((x) => x.id !== next.id)
          .flatMap((x) => x.answers.map((y) => y.itemId)),
      )?.id;
    setSession(next);
    await persist(next);
    if (next.status === "complete") setPage("result");
  }
  function open(s: Session) {
    setResumed(s.status === "active");
    setLang(s.lang);
    setSession(s);
    setPage(s.status === "complete" ? "result" : "test");
  }
  /* CR3ATIX_SHARE_V1 — aucun résultat, âge, score ou état de session n'est partagé. */
  async function shareApplication() {
    const url = "https://kevinlabens-del.github.io/SYNAPTIK-/";
    const copied = fr ? "Lien de SYNAPTIK copié" : "SYNAPTIK link copied";
    const notify = (message: string) => {
      setShareNotice(message);
      window.setTimeout(() => setShareNotice(""), 2500);
    };
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SYNAPTIK TEST QI",
          text: fr
            ? "Découvre SYNAPTIK TEST QI, une évaluation cognitive expérimentale et privée."
            : "Discover SYNAPTIK TEST QI, a private experimental cognitive assessment.",
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      if (window.isSecureContext && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        notify(copied);
        return;
      }
    } catch {}
    const field = document.createElement("textarea");
    field.value = url;
    field.readOnly = true;
    field.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, field.value.length);
    let didCopy = false;
    try { didCopy = document.execCommand("copy"); } catch {}
    field.remove();
    if (didCopy) notify(copied);
    else window.prompt(fr ? "Copie ce lien pour partager SYNAPTIK :" : "Copy this link to share SYNAPTIK:", url);
  }

  const item = session
    ? bank.find((i) => i.id === session.currentId)
    : undefined;
  return (
    <div className={`shell ${page === "test" ? "testing" : ""}`}>
      <header>
        <a
          className="brand"
          href="#/exploration"
          onClick={() => setPage("home")}
        >
          <span className="brand-mark">S</span>SYNAPTIK TEST QI
          <span className="brand-sub">
            {fr ? "TEST D’INTELLIGENCE COGNITIVE" : "COGNITIVE INTELLIGENCE TEST"}
          </span>
        </a>
        <div className="header-actions">
          <select
            aria-label={fr ? "Langue" : "Language"}
            value={lang}
            disabled={page === "test" || page === "demo"}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
          <button
            className="menu-toggle"
            type="button"
            aria-label={
              menuOpen
                ? fr
                  ? "Fermer le menu"
                  : "Close menu"
                : fr
                  ? "Ouvrir le menu"
                  : "Open menu"
            }
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        {menuOpen && (
          <button
            className="menu-backdrop"
            type="button"
            aria-label={fr ? "Fermer le menu" : "Close menu"}
            onClick={() => setMenuOpen(false)}
          />
        )}
        <nav
          id="main-menu"
          className={`burger-panel ${menuOpen ? "open" : ""}`}
          aria-label={fr ? "Menu principal" : "Main menu"}
          aria-hidden={!menuOpen}
        >
          <div className="menu-head">
            <div>
              <span className="eyebrow">SYNAPTIK TEST QI</span>
              <strong>{fr ? "Navigation" : "Navigation"}</strong>
            </div>
            <button
              type="button"
              className="menu-close"
              aria-label={fr ? "Fermer le menu" : "Close menu"}
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="menu-links">
            {(
              [
                ["home", t.home, "01"],
                ["setup", fr ? "Démarrer une analyse" : "Start assessment", "02"],
                ["history", t.history, "03"],
                ["practice", t.practice, "04"],
                ["method", t.method, "05"],
              ] as [Page, string, string][]
            ).map(([target, label, number]) => {
              const activeSection =
                target === "home"
                  ? ["home", "demo", "test", "result"].includes(page)
                  : page === target;
              return (
                <a
                  key={target}
                  href={`#/${pageRoutes[target]}`}
                  className={activeSection ? "menu-link active" : "menu-link"}
                  onClick={() => setPage(target)}
                >
                  <span>{number}</span>
                  <strong>{label}</strong>
                  <b>↗</b>
                </a>
              );
            })}
            <button
              type="button"
              className="menu-link"
              onClick={() => void shareApplication()}
              aria-label={fr ? "Partager SYNAPTIK TEST QI" : "Share SYNAPTIK TEST QI"}
              title={fr ? "Partager l’application" : "Share the app"}
            >
              <span>06</span>
              <strong>{fr ? "Partager l’application" : "Share the app"}</strong>
              <b>↗</b>
            </button>
          </div>
          {active && (
            <button className="menu-resume" onClick={() => open(active)}>
              <span>{fr ? "SESSION EN COURS" : "ACTIVE SESSION"}</span>
              <strong>
                {t.resume} · {active.answers.length}/{counts[active.mode]}
              </strong>
            </button>
          )}
          <div className="menu-meta">
            <span>{online ? (fr ? "EN LIGNE" : "ONLINE") : fr ? "HORS LIGNE" : "OFFLINE"}</span>
            <span>{fr ? "DONNÉES LOCALES" : "LOCAL DATA"}</span>
            {shareNotice && <span role="status" aria-live="polite">{shareNotice}</span>}
          </div>
        </nav>
      </header>
      {error && (
        <div role="alert" className="warning">
          {error}
          <button onClick={() => download(session, "synaptik-recovery.json")}>
            {fr ? "Exporter" : "Export"}
          </button>
        </div>
      )}
      <main>
        {page === "home" && (
          <>
            <div className="home-grid">
              <div className="hero-copy">
                <p className="eyebrow">
                  <span className="live-dot" />
                  {t.experimental}
                </p>
                <h1>
                  {fr ? (
                    <>
                      Explore
                      <br />
                      l’architecture
                      <br />
                      de ton <em>esprit.</em>
                    </>
                  ) : (
                    <>
                      Explore the
                      <br />
                      architecture
                      <br />
                      of your <em>mind.</em>
                    </>
                  )}
                </h1>
                <p className="lead">
                  {fr
                    ? "Six dimensions. Une empreinte unique. Explore tes capacités à travers une évaluation qui évolue avec toi."
                    : "Six dimensions. One unique fingerprint. Explore your abilities through an assessment that adapts to you."}
                </p>
                <button className="primary" onClick={() => setPage("setup")}>
                  {t.start}
                  <span>↗</span>
                </button>
                {active && (
                  <button className="text-button" onClick={() => open(active)}>
                    {t.resume} · {active.answers.length}/{counts[active.mode]}
                  </button>
                )}
                <p className="small">
                  {fr
                    ? "Estimation expérimentale · Sans valeur diagnostique"
                    : "Experimental estimate · No diagnostic value"}
                </p>
              </div>
              <div className="hero-network">
                <Neural lang={lang} />
                <div className="network-caption">
                  <span>{fr ? "01 / CARTOGRAPHIE NEURONALE" : "01 / NEURAL MAPPING"}</span>
                  <span>
                    {fr ? "6 DOMAINES CONNECTÉS" : "6 CONNECTED DOMAINS"}
                  </span>
                </div>
              </div>
            </div>
            <div className="domain-strip">
              {domains.map((d, i) => (
                <button
                  key={d}
                  onClick={() => {
                    setPracticeDomain(d);
                    setPage("practice");
                  }}
                >
                  <span>0{i + 1}</span>
                  {names[lang][d]}
                  <small>{domainActions[lang][i]}</small>
                </button>
              ))}
            </div>
            <p className="note">
              {fr
                ? "SYNAPTIK TEST QI cartographie une performance sur des exercices originaux. Cette édition ne dispose pas encore de normes humaines permettant de mesurer un QI validé."
                : "SYNAPTIK TEST QI maps performance on original tasks. This edition has no human norms for a validated IQ measurement."}
            </p>
          </>
        )}
        {page === "setup" && (
          <section className="reading">
            <p className="eyebrow">{fr ? "01 / PRÉPARATION" : "01 / PREPARATION"}</p>
            <h1>
              {fr ? "Prépare ton exploration." : "Prepare your exploration."}
            </h1>
            <p>
              {fr
                ? "Installe-toi au calme, seul, sans calculatrice ni recherche externe. Les durées sont indicatives ; la vitesse n’est chronométrée strictement que dans son domaine."
                : "Find a quiet place, work alone, without a calculator or external searches. Durations are indicative; only speed tasks have a strict deadline."}
            </p>
            <div className="modes">
              {(["quick", "standard", "deep"] as Mode[]).map((m, i) => (
                <button
                  className={mode === m ? "selected" : ""}
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                >
                  <span>0{i + 1}</span>
                  <h2>{modeNames[lang][m]}</h2>
                  <p>{["10–15", "25–35", "45–60"][i]} min</p>
                  <small>
                    {counts[m]}{" "}
                    {fr ? "réponses exploitables" : "usable responses"}
                  </small>
                </button>
              ))}
            </div>
            <p className="small">
              {fr
                ? "Plus de réponses fiables réduisent généralement l’incertitude du modèle, sans remplacer une calibration humaine."
                : "More reliable responses generally reduce model uncertainty, without replacing human calibration."}
            </p>
            <div className="form-grid">
              <label>
                {fr ? "Tranche d’âge" : "Age range"}
                <select value={age} onChange={(e) => setAge(e.target.value)}>
                  {["18–24", "25–44", "45–64", "65+"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                {fr ? "Appareil" : "Device"}
                <select
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                >
                  {["smartphone", "tablet", "computer"].map((v) => (
                    <option key={v} value={v}>{deviceNames[lang][v]}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="small">
              {fr
                ? "Version expérimentale pour adultes. L’âge est enregistré, mais aucune correction liée à l’âge n’est validée."
                : "Experimental adult edition. Age is recorded; no age adjustment is validated."}
            </p>
            <label className="check">
              <input
                type="checkbox"
                checked={recent}
                onChange={(e) => setRecent(e.target.checked)}
              />
              {fr
                ? "J’ai récemment passé un test similaire."
                : "I recently completed a similar test."}
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              {fr
                ? "Autoriser la préparation d’un export anonyme de calibration. Aucun envoi automatique."
                : "Allow preparation of an anonymous calibration export. Nothing is sent automatically."}
            </label>
            <div className="actions">
              <button className="primary" onClick={() => void start()}>
                {fr ? "Démarrer l’analyse" : "Start assessment"} <span>→</span>
              </button>
              <button
                onClick={() => {
                  setDemo(0);
                  setPage("demo");
                }}
              >
                {fr
                  ? "Voir les 3 exercices de démonstration"
                  : "View 3 demonstration exercises"}
              </button>
            </div>
            <p className="small">
              {fr
                ? "Les démonstrations sont facultatives et non notées. Elles ne modifient jamais ton score."
                : "Demonstrations are optional and unscored. They never affect your score."}
            </p>
          </section>
        )}
        {page === "demo" && (
          <section className="test-wrap">
            <p className="eyebrow">
              {fr ? "DÉMO" : "DEMO"} {demo + 1}/3 · {fr ? "NON NOTÉE" : "NOT SCORED"}
            </p>
            <Exercise
              key={demo}
              lang={lang}
              practice
              item={
                bank.filter(
                  (i) =>
                    i.domain ===
                    (["logic", "memory", "spatial"] as Domain[])[demo],
                )[0]
              }
              onAnswer={() => {
                if (demo < 2) setDemo(demo + 1);
                else setPage("setup");
              }}
            />
          </section>
        )}
        {page === "test" && session && item && (
          <section className="test-wrap">
            <div className="test-top">
              <svg
                viewBox="0 0 100 100"
                className="progress-ring"
                aria-label={`${session.answers.length}/${counts[session.mode]}`}
              >
                {domains.map((d, k) => (
                  <circle
                    key={d}
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={
                      domainAnswers(session, bank, d).length
                        ? "#54f4ff"
                        : "#263043"
                    }
                    strokeWidth="4"
                    pathLength="360"
                    strokeDasharray={`${(48 * domainAnswers(session, bank, d).length) / (counts[session.mode] / 6)} ${360 - (48 * domainAnswers(session, bank, d).length) / (counts[session.mode] / 6)}`}
                    transform={`rotate(${k * 60 - 90} 50 50)`}
                  />
                ))}
                <text x="50" y="56" textAnchor="middle">
                  {Math.round(
                    (100 * session.answers.length) / counts[session.mode],
                  )}
                  %
                </text>
              </svg>
              <div>
                <p className="eyebrow">
                  {names[lang][item.domain]} /{" "}
                  {fr ? "ADAPTATION EN COURS" : "CALIBRATING"}
                </p>
                <p>
                  {session.answers.length + 1} / {counts[session.mode]} ·{" "}
                  {modeNames[lang][session.mode].toUpperCase()}
                </p>
              </div>
              <button className="text-button" onClick={() => setPage("home")}>
                {fr ? "Pause et quitter" : "Pause and exit"}
              </button>
            </div>
            <Exercise
              key={item.id}
              item={item}
              resumed={resumed}
              lang={lang}
              timeLimit={
                session.testVersion === "1.2" && item.domain === "speed"
                  ? Math.max(12, item.estimatedTime)
                  : item.estimatedTime
              }
              onAnswer={(a) => void answer(a)}
            />
            {import.meta.env.DEV &&
              new URLSearchParams(location.search).get("debug") === "true" && (
                <pre>
                  {JSON.stringify(
                    {
                      item: item.id,
                      difficulty: item.difficulty,
                      estimate: estimate(
                        domainAnswers(session, bank, item.domain),
                        bank,
                      ),
                      history: session.answers.map((a) => a.theta),
                    },
                    null,
                    2,
                  )}
                </pre>
              )}
          </section>
        )}
        {page === "result" && session && r && (
          <section className="results">
            <p className="eyebrow">
              {fr ? "ANALYSE TERMINÉE" : "ANALYSIS COMPLETE"} ·{" "}
              {new Date(session.created).toLocaleDateString(lang)}
            </p>
            <h1>{t.result}</h1>
            <div className="result-grid">
              <div className="score-panel">
                <p>{fr ? "Estimation cognitive SYNAPTIK TEST QI" : "SYNAPTIK TEST QI Cognitive Estimate"}</p>
                {r.limited && (
                  <p className="warning">
                    {fr
                      ? "Profil exploratoire : données insuffisantes pour une estimation précise. Le nombre ci-dessous est une sortie du modèle, pas un QI mesuré."
                      : "Exploratory profile: insufficient data for a precise estimate. The number below is a model output, not a measured IQ."}
                  </p>
                )}
                <strong className="big-score">
                  {r.validCount ? r.score : "—"}
                </strong>
                <p>
                  {fr
                    ? "Équivalent QI expérimental"
                    : "Experimental IQ equivalent"}
                </p>
                <h2>
                  {r.interval[0]}–{r.interval[1]}
                </h2>
                <p className="small">
                  {fr
                    ? "Plage indicative conditionnelle au modèle"
                    : "Indicative model-conditional range"}
                </p>
                <div className="metrics">
                  <span>
                    <b>
                      {r.percentile === 0
                        ? "<1"
                        : r.percentile === 100
                          ? ">99"
                          : r.percentile}
                    </b>
                    {fr ? "percentile théorique" : "theoretical percentile"}
                  </span>
                  <span>
                    <b>
                      {r.reliability.label === "stable"
                        ? fr
                          ? "Stables"
                          : "Stable"
                        : fr
                          ? "Perturbées"
                          : "Disrupted"}
                    </b>
                    {fr ? "conditions de passation" : "session conditions"}
                  </span>
                  <span>
                    <b>
                      {r.validCount}/{session.answers.length}
                    </b>
                    {fr ? "réponses exploitables" : "usable responses"}
                  </span>
                </div>
              </div>
              <Neural lang={lang} scores={r.profiles.map((p) => p.score)} />
            </div>
            <div className="warning">
              {fr
                ? "Aucun groupe de référence humain n’a été utilisé. Le percentile repose sur une distribution normale théorique. L’intervalle ne mesure pas l’erreur inconnue liée à l’absence de calibration. Ce résultat n’est ni un QI clinique ni un diagnostic."
                : "No human reference group was used. The percentile uses a theoretical normal distribution. The interval does not measure unknown error from missing calibration. This is neither a clinical IQ nor a diagnosis."}
            </div>
            {session.recent && (
              <p className="warning">
                {fr
                  ? "Effet d’entraînement possible : cette session est proche d’un autre test."
                  : "Possible practice effect: this session is close to another test."}
              </p>
            )}
            <div className="profile-list">
              {r.profiles.map((p) => (
                <article key={p.domain}>
                  <span className="eyebrow">{names[lang][p.domain]}</span>
                  {p.limited && (
                    <p className="small">
                      {fr
                        ? "Incertitude élevée · davantage d’exercices nécessaires"
                        : "High uncertainty · more exercises needed"}
                    </p>
                  )}
                  <h2>
                    {p.n ? p.score : "—"}
                    <small> [{p.interval.join("–")}]</small>
                  </h2>
                  <div className="meter">
                    <span style={{ width: `${p.percentile}%` }} />
                  </div>
                  <p>
                    {p.correct}/{p.n} · {Math.round(p.meanTime / 1000)} s /{" "}
                    {fr ? "réponse" : "answer"} · P
                    {p.percentile === 0
                      ? "<1"
                      : p.percentile === 100
                        ? ">99"
                        : p.percentile}
                  </p>
                  <p className="small">
                    {fr
                      ? "Difficulté maximale rencontrée"
                      : "Maximum encountered difficulty"}{" "}
                    : {p.maxDifficulty}
                  </p>
                  <p className="small">
                    {fr ? "Variation des temps (CV)" : "Timing variation (CV)"}{" "}
                    :{" "}
                    {p.timingCV === null
                      ? "—"
                      : `${Math.round(p.timingCV * 100)} %`}
                  </p>
                </article>
              ))}
            </div>
            <AnswerReview session={session} bank={sessionBank} lang={lang} />
            <h2>{fr ? "Lecture du profil" : "Profile interpretation"}</h2>
            <p>
              {fr
                ? "Performance relative la plus élevée"
                : "Highest relative performance"}{" "}
              :{" "}
              <b>
                {
                  names[lang][
                    [...r.profiles].sort((a, b) => b.score - a.score)[0].domain
                  ]
                }
              </b>
              .{" "}
              {fr
                ? "Domaine à explorer davantage"
                : "Domain to explore further"}{" "}
              :{" "}
              <b>
                {
                  names[lang][
                    [...r.profiles].sort((a, b) => a.score - b.score)[0].domain
                  ]
                }
              </b>
              .{" "}
              {fr
                ? "Les écarts restent descriptifs ; des intervalles qui se recouvrent ne permettent pas de conclure à une différence stable."
                : "Differences are descriptive; overlapping intervals do not establish stable differences."}
            </p>
            <p>
              {fr ? "Signaux de session" : "Session signals"} :{" "}
              {r.reliability.rapid}{" "}
              {fr ? "réponses très rapides" : "very fast responses"},{" "}
              {session.interruptions} {fr ? "interruptions" : "interruptions"}.{" "}
              {fr
                ? "Cet indice est heuristique, pas un coefficient de fiabilité psychométrique."
                : "This index is heuristic, not a psychometric reliability coefficient."}
            </p>
            <p className="small">
              {fr
                ? "Inversions difficulté/réussite observées"
                : "Observed difficulty/success reversals"}{" "}
              : {r.reliability.irregularPairs}/{r.reliability.comparablePairs}.{" "}
              {fr
                ? "Indicateur descriptif : une inversion isolée est normale et ne prouve rien sur la validité de la session."
                : "Descriptive indicator: an isolated reversal is normal and does not invalidate a session."}
            </p>
            <p className="small">
              {fr
                ? "Méthode : estimation bayésienne par domaine, transformation 100 + 15 × theta, moyenne pondérée des six domaines. Paramètres provisoires, sans étalonnage humain."
                : "Method: Bayesian estimation by domain, 100 + 15 × theta transformation, weighted mean of six domains. Provisional parameters without human calibration."}
            </p>
            <div className="actions">
              <button className="primary" onClick={() => window.print()}>
                {t.print}
              </button>
              <button
                onClick={() => download(session, "synaptik-session.json")}
              >
                Export JSON
              </button>
              {session.consent && (
                <button
                  onClick={() =>
                    download(
                      {
                        ...session,
                        id: crypto.randomUUID(),
                        created: undefined,
                        device: undefined,
                      },
                      "synaptik-calibration.json",
                    )
                  }
                >
                  {fr ? "Export de calibration" : "Calibration export"}
                </button>
              )}
            </div>
          </section>
        )}
        {page === "history" && (
          <section className="reading">
            <p className="eyebrow">{fr ? "MON HISTORIQUE COGNITIF" : "MY COGNITIVE HISTORY"}</p>
            <h1>{t.history}</h1>
            <p>
              {fr
                ? "Compare les sessions avec prudence : apprentissage, fatigue et appareil peuvent modifier les résultats."
                : "Compare sessions cautiously: learning, fatigue and device can affect results."}
            </p>
            {!sessions.length && (
              <div className="empty">
                <h2>
                  {fr
                    ? "Ta carte reste à explorer."
                    : "Your map is still unexplored."}
                </h2>
                <button className="primary" onClick={() => setPage("setup")}>
                  {t.start}
                </button>
              </div>
            )}
            {[...sessions]
              .sort((a, b) => b.created.localeCompare(a.created))
              .map((s) => {
                const rr = report(s, makeBank(s.lang));
                return (
                  <article className="history-row" key={s.id}>
                    <button onClick={() => open(s)}>
                      <span>
                        {new Date(s.created).toLocaleString(lang)} · {modeNames[lang][s.mode]}
                      </span>
                      <strong>
                        {s.status === "complete" ? rr.score : "↻"}
                      </strong>
                      <small>
                        {s.status === "complete"
                          ? `${rr.interval.join("–")} · P${rr.percentile} · ${rr.reliability.value}/100`
                          : `${s.answers.length}/${counts[s.mode]}`}
                      </small>
                      <small>
                        {rr.profiles
                          .map((p) => `${names[lang][p.domain]} ${p.score}`)
                          .join(" · ")}
                      </small>
                    </button>
                    <button
                      aria-label={
                        fr ? "Supprimer cette session" : "Delete session"
                      }
                      onClick={async () => {
                        if (
                          confirm(
                            fr
                              ? "Supprimer cette session ?"
                              : "Delete this session?",
                          )
                        ) {
                          await db.remove(s.id);
                          setSessions(await db.list());
                        }
                      }}
                    >
                      ×
                    </button>
                  </article>
                );
              })}
            <div className="actions">
              <button
                onClick={() => download(sessions, "synaptik-history.json")}
              >
                {fr ? "Exporter toutes mes données" : "Export all data"}
              </button>
              <button
                onClick={async () => {
                  if (
                    confirm(
                      fr
                        ? "Effacer définitivement toutes les sessions locales ?"
                        : "Permanently erase all local sessions?",
                    )
                  ) {
                    await db.clear();
                    setSessions([]);
                    setSession(null);
                  }
                }}
              >
                {fr ? "Tout effacer" : "Erase all"}
              </button>
            </div>
          </section>
        )}
        {page === "practice" && (
          <section className="test-wrap">
            <p className="eyebrow">
              {fr ? "LABORATOIRE D’ENTRAÎNEMENT" : "PRACTICE LAB"} ·{" "}
              {fr
                ? "SANS INFLUENCE SUR LES SCORES"
                : "DOES NOT AFFECT ASSESSMENT SCORES"}
            </p>
            <h1>{t.practice}</h1>
            <div className="domain-tabs">
              {domains.map((d) => (
                <button
                  className={d === practiceDomain ? "selected" : ""}
                  key={d}
                  onClick={() => {
                    setPracticeDomain(d);
                    setPracticeIndex(0);
                  }}
                >
                  {names[lang][d]}
                </button>
              ))}
            </div>
            <Exercise
              key={`${practiceDomain}-${practiceIndex}-${lang}`}
              lang={lang}
              practice
              item={
                bank.filter((i) => i.domain === practiceDomain)[
                  practiceIndex % 60
                ]
              }
              onAnswer={() => setPracticeIndex(practiceIndex + 1)}
            />
          </section>
        )}
        {page === "method" && (
          <section className="reading">
            <p className="eyebrow">{fr ? "SCIENCE / TRANSPARENCE" : "SCIENCE / TRANSPARENCY"}</p>
            <h1>
              {fr ? "Une carte. Pas une étiquette." : "A map. Not a label."}
            </h1>
            <h2>
              {fr ? "Comment fonctionne SYNAPTIK TEST QI ?" : "How does SYNAPTIK TEST QI work?"}
            </h2>
            <p>
              {fr
                ? "Chaque domaine possède une capacité latente estimée par une grille bayésienne. La sélection recherche des exercices informatifs proches du niveau estimé. Les paramètres de difficulté et de discrimination sont provisoires et non mesurés sur des humains."
                : "Each domain has a latent ability estimated using a Bayesian grid. Selection targets informative items near estimated ability. Difficulty and discrimination parameters are provisional, not measured on people."}
            </p>
            <h2>{fr ? "Scores et incertitude" : "Scores and uncertainty"}</h2>
            <p>
              {fr
                ? "La transformation 100 + 15 × theta fournit une échelle expérimentale. Le percentile vient de la loi normale standard, pas d’une population observée. L’incertitude statistique est conditionnelle aux paramètres supposés. Les sous-scores ont un poids égal ; la rapidité ne bonifie jamais les réponses incorrectes."
                : "The transformation 100 + 15 × theta provides an experimental scale. Percentiles come from a standard normal distribution, not an observed population. Statistical uncertainty is conditional on assumed parameters. Domains have equal weights; speed never rewards incorrect answers."}
            </p>
            <h2>{fr ? "Données privées" : "Private data"}</h2>
            <p>
              {fr
                ? "Tout reste dans IndexedDB sur cet appareil. Aucun traceur, compte, serveur de résultats ni collecte automatique. Effacer les données du navigateur supprime aussi les sessions. Un export volontaire peut être préparé pour une future calibration."
                : "Everything stays in IndexedDB on this device. No trackers, accounts, results server or automatic collection. Clearing browser data also removes sessions. A voluntary export can be prepared for future calibration."}
            </p>
            <h2>{fr ? "Limites connues" : "Known limitations"}</h2>
            <p>
              {fr
                ? "Banque générée : 360 variantes par langue, plusieurs gabarits réutilisés. Les variantes ne sont pas 360 concepts indépendants. Les items verbaux anglais et français nécessitent une validation humaine séparée. Les normes par âge, l’équivalence entre appareils et la validité clinique ne sont pas établies."
                : "Generated bank: 360 variants per language, with repeated templates. Variants are not 360 independent concepts. English and French verbal items require separate human validation. Age norms, device equivalence and clinical validity are not established."}
            </p>
            {import.meta.env.DEV && (
              <>
                <h2>{fr ? "Développement / calibration" : "Developer / calibration"}</h2>
                {DevPanel && (
                  <Suspense fallback={<p>Chargement…</p>}>
                    <DevPanel />
                  </Suspense>
                )}
                <pre>
                  {JSON.stringify(
                    {
                      items: bank.length,
                      domains: domains.map((d) => ({
                        domain: d,
                        n: bank.filter((i) => i.domain === d).length,
                      })),
                      calibrationStatus: "experimental",
                      sampleSize: 0,
                    },
                    null,
                    2,
                  )}
                </pre>
              </>
            )}
          </section>
        )}
      </main>
      <footer>
        <Install lang={lang} />
        <span>
          SYNAPTIK TEST QI <b> / </b>{" "}{fr ? "TEST D’INTELLIGENCE COGNITIVE" : "COGNITIVE INTELLIGENCE TEST"}
        </span>
        <span>
          {online
            ? t.local
            : fr
              ? "HORS LIGNE · DONNÉES LOCALES"
              : "OFFLINE · LOCAL DATA"}
        </span>
        <small>
          {fr ? "Expérimental · Non clinique" : "Experimental · Non-clinical"}
        </small>
        <small className="creator-credit">
          {fr ? "Créé par " : "Created by "}
          <strong>CR3@TIX</strong>
        </small>
      </footer>
    </div>
  );
}
