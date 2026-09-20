import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/main.css";

createRoot(document.getElementById("root")!).render(<App />);

const SAFE_UPDATE_PAGES = new Set(["home", "history", "practice", "method"]);
let updateReloadPending = false;
let updateReloading = false;

function canReloadForUpdate() {
  const page = document.documentElement.dataset.synaptikPage ?? "home";
  return SAFE_UPDATE_PAGES.has(page);
}

function reloadForUpdateWhenSafe() {
  if (updateReloading) return;
  if (canReloadForUpdate()) {
    updateReloading = true;
    location.reload();
  } else {
    updateReloadPending = true;
  }
}

window.addEventListener("synaptik-page-change", () => {
  if (updateReloadPending && canReloadForUpdate()) {
    updateReloadPending = false;
    reloadForUpdateWhenSafe();
  }
});

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    let hadController = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        const activate = (worker: ServiceWorker | null) => {
          worker?.postMessage("ACTIVATE");
        };

        if (reg.waiting) activate(reg.waiting);

        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          worker?.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              activate(worker);
            }
          });
        });

        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!hadController) {
            hadController = true;
            return;
          }
          reloadForUpdateWhenSafe();
        });

        const checkForUpdate = () => {
          void reg.update().catch(() => {
            // Une absence de réseau ne doit jamais gêner l'utilisation hors ligne.
          });
        };

        checkForUpdate();
        window.addEventListener("focus", checkForUpdate);
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") checkForUpdate();
        });
        window.setInterval(checkForUpdate, 30 * 60 * 1000);
      })
      .catch(console.error);
  });
}
