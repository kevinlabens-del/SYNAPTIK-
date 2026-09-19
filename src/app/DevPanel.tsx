import { useEffect, useRef, useState } from "react";
export default function DevPanel() {
  const [theta, setTheta] = useState(0),
    [n, setN] = useState(1000),
    [result, setResult] = useState(""),
    [running, setRunning] = useState(false);
  const worker = useRef<Worker | null>(null);
  useEffect(() => () => worker.current?.terminate(), []);
  return (
    <section>
      <h2>Simulation laboratoire</h2>
      <p>Sessions artificielles uniquement. Aucune validation humaine.</p>
      <label>
        Capacité simulée : {theta}
        <input
          type="range"
          min="-3"
          max="3"
          step=".5"
          value={theta}
          onChange={(e) => setTheta(Number(e.target.value))}
        />
      </label>
      <label>
        Sessions
        <input
          type="number"
          min="1"
          max="5000"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
        />
      </label>
      <button
        disabled={running}
        onClick={() => {
          setRunning(true);
          worker.current = new Worker(
            new URL("../workers/simulator.ts", import.meta.url),
            { type: "module" },
          );
          worker.current.onmessage = (e) => {
            setResult(JSON.stringify(e.data, null, 2));
            if (e.data.progress === 1) {
              setRunning(false);
              worker.current?.terminate();
            }
          };
          worker.current.onerror = () => {
            setRunning(false);
            setResult("Simulation interrompue");
          };
          worker.current.postMessage({ theta, n });
        }}
      >
        {running ? "Simulation en cours…" : "Simuler"}
      </button>
      <pre>{result}</pre>
    </section>
  );
}
