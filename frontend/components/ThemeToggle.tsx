"use client";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const running = useRef(false);
  useEffect(() => {
    const sync = () =>
      setDark(document.documentElement.dataset.theme === "dark");
    const storage = (event: StorageEvent) => {
      if (event.key !== "portfolio-theme") return;
      document.documentElement.dataset.theme =
        event.newValue === "dark" ? "dark" : "light";
      sync();
    };
    sync();
    addEventListener("storage", storage);
    return () => removeEventListener("storage", storage);
  }, []);
  async function toggle(event: MouseEvent<HTMLButtonElement>) {
    if (running.current) return;
    const root = document.documentElement;
    const next =
      root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      setDark(next === "dark");
      try {
        localStorage.setItem("portfolio-theme", next);
      } catch {
        /* Theme remains usable without storage. */
      }
    };
    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.classList.contains("motion-off")
    ) {
      apply();
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    running.current = true;
    // Freeze existing CSS/WAAPI effects so snapshots don't keep repainting.
    const animations = document.getAnimations().filter(animation => animation.playState === "running");
    animations.forEach(animation => animation.pause());
    root.classList.add("theme-wave");
    let transition: ReturnType<Document["startViewTransition"]> | undefined;
    let reveal: Animation | undefined;
    try {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      transition = document.startViewTransition(() => {
        root.dataset.theme = next;
      });
      await transition.ready;
      reveal = root.animate(
        { clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${Math.ceil(radius) + 2}px at ${x}px ${y}px)`,
        ] },
        { duration: 520, easing: "cubic-bezier(.22,1,.36,1)",
          pseudoElement: "::view-transition-new(root)", fill: "both" },
      );
      await reveal.finished;
      await transition.finished;
    } catch {
      transition?.skipTransition();
      await transition?.finished.catch(() => {});
    } finally {
      reveal?.cancel();
      apply();
      root.classList.remove("theme-wave");
      animations.forEach(animation => {
        if (animation.playState === "paused") animation.play();
      });
      running.current = false;
    }
  }
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label="Тёмная тема"
      aria-pressed={dark}
      title="Переключить светлую и тёмную тему"
    >
      <span className="theme-sun" aria-hidden="true">
        ☀
      </span>
      <span className="theme-moon" aria-hidden="true">
        ☾
      </span>
      <span>Тема</span>
    </button>
  );
}
