import { useEffect, useState } from "react";
import type { Lang } from "../cognitive/types";
interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}
export function Install({ lang }: { lang: Lang }) {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallEvent);
    };
    const installed = () => setPrompt(null);
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  return prompt ? (
    <button
      onClick={async () => {
        await prompt.prompt();
        await prompt.userChoice;
        setPrompt(null);
      }}
    >
      {lang === "fr" ? "Installer SYNAPTIK" : "Install SYNAPTIK"}
    </button>
  ) : null;
}
