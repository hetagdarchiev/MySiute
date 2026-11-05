"use client";
import { useEffect, useState } from "react";
export default function Motion() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    setPaused(media.matches);
    const change = () => setPaused(media.matches);
    media.addEventListener("change", change);
    const root = document.documentElement;
    const nodes = document.querySelectorAll<HTMLElement>(
      ".reveal,.section-label,.about-content h2,.about-columns p,.facts>div,.section-heading,.skill-row,.github-strip,.contact-title h2,.circle-link,.contact-links>a,.project-card,.capability,.growth-steps article,.growth-layout h2,.projects-section h2,.capabilities h2,.contact-copy",
    );
    nodes.forEach((n, i) => {
      n.classList.add("reveal");
      if (n.classList.contains("skill-row"))
        n.classList.add(i % 2 ? "from-left" : "from-right");
    });
    document
      .querySelectorAll<HTMLElement>(
        ".project-card,.capability,.growth-steps article,.contact-links>a",
      )
      .forEach((n) => {
        const index = Array.from(n.parentElement?.children || []).indexOf(n);
        n.style.setProperty("--delay", `${(index % 3) * 100}ms`);
      });
    document
      .querySelectorAll<HTMLElement>(".tags span,.tags .shatter-tag")
      .forEach((n, i) =>
        n.style.setProperty("--tag-delay", `${(i % 6) * 55}ms`),
      );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".reveal,.photo-reveal")
      .forEach((n) => observer.observe(n));
    root.classList.add("motion-ready");
    return () => {
      observer.disconnect();
      media.removeEventListener("change", change);
      root.classList.remove("motion-ready", "motion-off");
    };
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("motion-off", paused);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.documentElement.classList.contains("theme-wave")) return;
      const range = document.documentElement.scrollHeight - innerHeight;
      const bar = document.querySelector<HTMLElement>(".scroll-progress");
      if (bar)
        bar.style.transform = `scaleX(${range > 0 ? scrollY / range : 0})`;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("resize", scroll);
    update();
    return () => {
      removeEventListener("scroll", scroll);
      removeEventListener("resize", scroll);
      cancelAnimationFrame(frame);
    };
  }, [paused]);
  useEffect(() => {
    if (
      paused ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const cleanups: (() => void)[] = [];
    document
      .querySelectorAll<HTMLElement>(".project-art,.button,.circle-link")
      .forEach((el) => {
        const art = el.classList.contains("project-art");
        const x = art ? "--pointer-x" : "--magnet-x";
        const y = art ? "--pointer-y" : "--magnet-y";
        const move = (event: PointerEvent) => {
          if (document.documentElement.classList.contains("theme-wave")) return;
          const r = el.getBoundingClientRect();
          el.style.setProperty(
            x,
            `${((event.clientX - r.left) / r.width - 0.5) * (art ? 20 : 8)}px`,
          );
          el.style.setProperty(
            y,
            `${((event.clientY - r.top) / r.height - 0.5) * (art ? 16 : 8)}px`,
          );
        };
        const reset = () => {
          el.style.removeProperty(x);
          el.style.removeProperty(y);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", reset);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", reset);
          reset();
        });
      });
    return () => cleanups.forEach((fn) => fn());
  }, [paused]);
  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <button
        className="motion-toggle"
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        Анимация: {paused ? "выкл." : "вкл."}
      </button>
    </>
  );
}
