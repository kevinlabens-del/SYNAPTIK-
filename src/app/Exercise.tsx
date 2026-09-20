import { Cubes } from "./Cubes";
import { useEffect, useRef, useState } from "react";
import type { Item, Answer, Lang } from "../cognitive/types";
import { subtypeName } from "./i18n";
function Grid({ cells }: { cells: number[] }) {
  return (
    <svg
      className="pattern-grid"
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Cases / cells: ${cells.map((c) => c + 1).join(", ")}`}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={(i % 3) * 40 + 3}
          y={Math.floor(i / 3) * 40 + 3}
          width="34"
          height="34"
          rx="2"
          fill={cells.includes(i) ? "#54f4ff" : "#162637"}
        />
      ))}
    </svg>
  );
}
export function Exercise({
  item,
  onAnswer,
  lang,
  practice = false,
  resumed = false,
  timeLimit,
}: {
  item: Item;
  onAnswer: (a: Omit<Answer, "theta">) => void;
  lang: Lang;
  practice?: boolean;
  resumed?: boolean;
  timeLimit?: number;
}) {
  const [ready, setReady] = useState(item.domain !== "speed");
  const selectedAt = useRef<number | null>(null);
  const [phase, setPhase] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [exposed, setExposed] = useState(!!item.exposureMs && !resumed);
  const [expired, setExpired] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const start = useRef(performance.now());
  const first = useRef<number | null>(null);
  const changes = useRef(0);
  const interrupted = useRef(resumed);
  const submitted = useRef(false);
  const fr = lang === "fr";
  const responseLimit = timeLimit ?? item.estimatedTime;
  useEffect(() => {
    if (!ready) return;
    start.current = performance.now();
    const hidden = () => {
      if (document.hidden) {
        interrupted.current = true;
        if (item.exposureMs) setExposed(false);
      }
    };
    document.addEventListener("visibilitychange", hidden);
    const timer = item.exposureMs
      ? setTimeout(() => setExposed(false), item.exposureMs)
      : undefined;
    const sequenceTimer = item.sequence
      ? setInterval(
          () => setPhase(Math.floor((performance.now() - start.current) / 900)),
          100,
        )
      : undefined;
    const deadline =
      item.domain === "speed"
        ? setTimeout(() => setExpired(true), responseLimit * 1000)
        : undefined;
    return () => {
      document.removeEventListener("visibilitychange", hidden);
      clearTimeout(timer);
      clearTimeout(deadline);
      clearInterval(sequenceTimer);
    };
  }, [item, ready, responseLimit]);
  function choose(i: number) {
    if (
      item.domain === "speed" &&
      performance.now() - start.current >= responseLimit * 1000
    ) {
      setExpired(true);
      return;
    }
    if (!ready || expired || exposed || feedback) return;
    selectedAt.current = performance.now() - start.current;
    if (first.current === null)
      first.current = performance.now() - start.current;
    if (choice !== null && choice !== i) changes.current++;
    setChoice(i);
  }
  function finish() {
    if (submitted.current) return;
    submitted.current = true;
    onAnswer({
      itemId: item.id,
      choice: choice ?? -1,
      correct: choice === item.correctAnswer,
      duration:
        item.domain === "speed"
          ? (selectedAt.current ?? responseLimit * 1000)
          : performance.now() - start.current,
      selectionTime: selectedAt.current ?? undefined,
      timedOut: expired,
      excluded: interrupted.current,
      firstInteraction: first.current,
      changes: changes.current,
      interrupted: interrupted.current,
    });
  }
  if (!ready)
    return (
      <section className="exercise">
        <p className="eyebrow">
          {fr ? "Vitesse · préparation" : "Speed · preparation"}
        </p>
        <h2>{item.prompt}</h2>
        <p>
          {fr
            ? `Lis tranquillement la question : le chronomètre est arrêté. Quand tu appuieras sur « Je suis prêt », l’exercice apparaîtra et tu auras ${responseLimit} secondes pour répondre. La confirmation n’entre pas dans le temps de réponse.`
            : `Read the question at your own pace: the timer is stopped. When you press “I’m ready”, the exercise will appear and you will have ${responseLimit} seconds to answer. Confirmation is not included in response time.`}
        </p>
        <button className="primary" onClick={() => setReady(true)}>
          {fr ? "Je suis prêt" : "I’m ready"}
        </button>
      </section>
    );
  return (
    <section
      className="exercise"
      onKeyDown={(e) => {
        if (/^[1-4]$/.test(e.key) && Number(e.key) <= item.options.length)
          choose(Number(e.key) - 1);
      }}
    >
      {resumed && (
        <p className="small">
          {fr
            ? "Exercice repris : interruption signalée. Pour la mémoire, la séquence ne sera pas réaffichée."
            : "Resumed item: interruption recorded. Memory stimuli are not shown again."}
        </p>
      )}
      <p className="eyebrow">
        {subtypeName(lang, item.subtype)}{" "}
        {item.domain === "speed" && ` · ${responseLimit} s`}
      </p>
      <h2>{item.prompt}</h2>
      {item.sequence && exposed && (
        <div className="stimulus" aria-live="polite">
          {item.sequence[phase] ?? "·"}
        </div>
      )}
      {item.cubes && <Cubes heights={item.cubes} />}
      {item.matrix && (
        <div
          className="matrix"
          role="table"
          aria-label={fr ? "Matrice de raisonnement" : "Reasoning matrix"}
        >
          {item.matrix.map((row, r) => (
            <div role="row" key={r}>
              {row.map((cell, c) => (
                <span role="cell" key={c}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {item.shapeCells && (!item.exposureMs || exposed) && (
        <div className="pattern-model">
          <Grid cells={item.shapeCells} />
        </div>
      )}
      {item.shape && (
        <svg
          className="spatial-grid"
          viewBox="0 0 320 320"
          role="img"
          aria-label={`x=${item.shape[0]}, y=${item.shape[1]}`}
        >
          <path d="M20 160H300M160 300V20" stroke="#8da5bc" />
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <text x={160 + (i - 3) * 35} y="180" fill="#adbed2" fontSize="12">
                {i - 3}
              </text>
              <text x="140" y={160 - (i - 3) * 35} fill="#adbed2" fontSize="12">
                {i - 3}
              </text>
            </g>
          ))}
          <circle
            cx={160 + item.shape[0] * 35}
            cy={160 - item.shape[1] * 35}
            r="8"
            fill="#54f4ff"
          />
          <text x="302" y="154" fill="white">
            x
          </text>
          <text x="170" y="20" fill="white">
            y
          </text>
        </svg>
      )}
      {item.stimulus && (!item.exposureMs || exposed) && (
        <div className="stimulus" aria-live="polite">
          {item.stimulus}
        </div>
      )}
      {exposed ? (
        <p role="status">
          {fr
            ? "Mémorise… les réponses apparaîtront ensuite."
            : "Memorize… answer choices will appear next."}
        </p>
      ) : (
        <>
          <div className="options">
            {item.options.map((o, i) => (
              <button
                key={o}
                className={choice === i ? "option selected" : "option"}
                aria-pressed={choice === i}
                disabled={expired || feedback}
                onClick={() => choose(i)}
              >
                <span>{i + 1}</span>
                {item.visualOptions === "grid" ? (
                  <Grid cells={o.split(",").map(Number)} />
                ) : (
                  o
                )}
              </button>
            ))}
          </div>
          {expired && (
            <p role="status">
              {fr
                ? "Temps écoulé. Ta sélection est conservée."
                : "Time elapsed. Your selection is retained."}
            </p>
          )}
          {feedback ? (
            <div className="feedback">
              <p>
                {choice === item.correctAnswer
                  ? fr
                    ? "Réponse correcte."
                    : "Correct answer."
                  : fr
                    ? "À revoir."
                    : "Try again next time."}{" "}
                {item.explanation}
              </p>
              <button className="primary" onClick={finish}>
                {fr ? "Exercice suivant" : "Next exercise"}
              </button>
            </div>
          ) : (
            <button
              className="primary"
              disabled={choice === null && !expired && !resumed}
              onClick={() => (practice ? setFeedback(true) : finish())}
            >
              {fr ? "Valider ma réponse" : "Confirm answer"} <span>→</span>
            </button>
          )}
        </>
      )}
    </section>
  );
}
