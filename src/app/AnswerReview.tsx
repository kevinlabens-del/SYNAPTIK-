import type { Answer, Item, Lang, Session } from "../cognitive/types";
import { Cubes } from "./Cubes";
import { names, subtypeName } from "./i18n";

function Grid({ cells, lang }: { cells: number[]; lang: Lang }) {
  return (
    <svg
      className="review-pattern-grid"
      viewBox="0 0 120 120"
      role="img"
      aria-label={`${lang === "fr" ? "Cases" : "Cells"} : ${cells
        .map((c) => c + 1)
        .join(", ")}`}
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

function AnswerValue({
  item,
  index,
  lang,
}: {
  item: Item;
  index: number;
  lang: Lang;
}) {
  if (index < 0 || index >= item.options.length)
    return <em>{lang === "fr" ? "Aucune réponse" : "No answer"}</em>;
  const value = item.options[index];
  if (item.visualOptions === "grid")
    return <Grid cells={value.split(",").map(Number)} lang={lang} />;
  return <span>{value}</span>;
}

function QuestionContext({ item, lang }: { item: Item; lang: Lang }) {
  return (
    <div className="review-context">
      {item.stimulus && (
        <p>
          <b>{lang === "fr" ? "Élément présenté" : "Presented stimulus"} :</b>{" "}
          {item.stimulus}
        </p>
      )}
      {item.sequence && (
        <p>
          <b>{lang === "fr" ? "Séquence" : "Sequence"} :</b>{" "}
          {item.sequence.join(" → ")}
        </p>
      )}
      {item.shapeCells && (
        <div>
          <b>{lang === "fr" ? "Modèle" : "Model"} :</b>
          <Grid cells={item.shapeCells} lang={lang} />
        </div>
      )}
      {item.shape && (
        <p>
          <b>{lang === "fr" ? "Point présenté" : "Presented point"} :</b> x=
          {item.shape[0]}, y={item.shape[1]}
        </p>
      )}
      {item.cubes && <Cubes heights={item.cubes} />}
      {item.matrix && (
        <div
          className="review-matrix"
          role="table"
          aria-label={lang === "fr" ? "Matrice de la question" : "Question matrix"}
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
    </div>
  );
}

function ReviewRow({
  answer,
  item,
  index,
  lang,
}: {
  answer: Answer;
  item: Item;
  index: number;
  lang: Lang;
}) {
  const fr = lang === "fr";
  const status = answer.excluded
    ? fr
      ? "Non comptée"
      : "Excluded"
    : answer.correct
      ? fr
        ? "Correcte"
        : "Correct"
      : fr
        ? "Erreur"
        : "Incorrect";

  return (
    <details
      className={`answer-review-item ${answer.correct ? "is-correct" : "is-wrong"} ${answer.excluded ? "is-excluded" : ""}`}
    >
      <summary>
        <span className="review-number">{String(index + 1).padStart(2, "0")}</span>
        <span>
          <b>{names[lang][item.domain]}</b>
          <small>{subtypeName(lang, item.subtype)}</small>
        </span>
        <span className="review-status">{status}</span>
      </summary>
      <div className="review-body">
        <h3>{item.prompt}</h3>
        <QuestionContext item={item} lang={lang} />
        <div className="review-answer-grid">
          <div>
            <span className="eyebrow">{fr ? "TA RÉPONSE" : "YOUR ANSWER"}</span>
            <div className="review-answer-value">
              <AnswerValue item={item} index={answer.choice} lang={lang} />
            </div>
          </div>
          <div>
            <span className="eyebrow">
              {fr ? "BONNE RÉPONSE" : "CORRECT ANSWER"}
            </span>
            <div className="review-answer-value is-correct">
              <AnswerValue item={item} index={item.correctAnswer} lang={lang} />
            </div>
          </div>
        </div>
        <p className="review-explanation">
          <b>{fr ? "Pourquoi" : "Why"} :</b> {item.explanation}
        </p>
        <p className="small review-meta">
          {fr ? "Temps de réponse" : "Response time"} :{" "}
          {(answer.duration / 1000).toFixed(1)} s
          {answer.timedOut ? ` · ${fr ? "temps écoulé" : "timed out"}` : ""}
          {answer.interrupted
            ? ` · ${fr ? "interruption détectée" : "interruption detected"}`
            : ""}
          {answer.excluded
            ? ` · ${fr ? "non utilisée dans le score" : "not used in score"}`
            : ""}
        </p>
      </div>
    </details>
  );
}

export function AnswerReview({
  session,
  bank,
  lang,
}: {
  session: Session;
  bank: Item[];
  lang: Lang;
}) {
  const fr = lang === "fr";
  const rows = session.answers
    .map((answer, index) => ({
      answer,
      index,
      item: bank.find((item) => item.id === answer.itemId),
    }))
    .filter((row): row is { answer: Answer; index: number; item: Item } =>
      Boolean(row.item),
    );
  const usable = rows.filter((r) => !r.answer.excluded);
  const correct = usable.filter((r) => r.answer.correct).length;
  const errors = usable.length - correct;

  return (
    <section className="answer-review">
      <div className="answer-review-heading">
        <div>
          <p className="eyebrow">
            {fr ? "CORRECTION APRÈS ÉVALUATION" : "POST-ASSESSMENT REVIEW"}
          </p>
          <h2>{fr ? "Revoir mes réponses" : "Review my answers"}</h2>
        </div>
        <div className="answer-review-summary">
          <span>
            <b>{correct}</b>
            {fr ? "correctes" : "correct"}
          </span>
          <span>
            <b>{errors}</b>
            {fr ? "erreurs" : "errors"}
          </span>
        </div>
      </div>
      <p className="small">
        {fr
          ? "Ouvre une question pour voir ta réponse, la bonne réponse et l’explication. Cette correction n’apparaît qu’une fois l’évaluation terminée."
          : "Open a question to see your answer, the correct answer and the explanation. This review is only available after the assessment is complete."}
      </p>
      <div className="answer-review-list">
        {rows.map(({ answer, item, index }) => (
          <ReviewRow
            key={`${answer.itemId}-${index}`}
            answer={answer}
            item={item}
            index={index}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}
