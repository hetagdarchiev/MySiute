"use client";
import { useEffect, useRef, useState } from "react";

let activeBursts = 0;
export default function ShatterTag({
  label,
  featured = false,
}: {
  label: string;
  featured?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const cleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => cleanup.current?.(), []);

  function shatter(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (
      cleanup.current ||
      activeBursts >= 3 ||
      media.matches ||
      document.documentElement.classList.contains("motion-off")
    )
      return;
    if (!button.animate) return;
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    const layer = document.createElement("div");
    layer.className = "shatter-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.append(layer);
    activeBursts++;
    const animations: Animation[] = [];
    let finished = false;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains("motion-off")) finish();
    });
    const onReduce = () => {
      if (media.matches) finish();
    };
    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      observer.disconnect();
      media.removeEventListener("change", onReduce);
      animations.forEach((a) => a.cancel());
      layer.remove();
      activeBursts--;
      cleanup.current = null;
      setBroken(false);
    }
    cleanup.current = finish;
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    media.addEventListener("change", onReduce);
    const fall = innerHeight - rect.top + rect.height + 100;
    try {
      for (let row = 0; row < 2; row++) {
        for (let column = 0; column < 3; column++) {
          for (let half = 0; half < 2; half++) {
            const shard = document.createElement("div");
            shard.className = "shatter-shard";
            shard.textContent = label;
            const x0 = (column * 100) / 3,
              x1 = ((column + 1) * 100) / 3;
            const y0 = row * 50,
              y1 = (row + 1) * 50;
            const polygon =
              half === 0
                ? `${x0}% ${y0}%,${x1}% ${y0}%,${x0}% ${y1}%`
                : `${x1}% ${y0}%,${x1}% ${y1}%,${x0}% ${y1}%`;
            Object.assign(shard.style, {
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              font: style.font,
              letterSpacing: style.letterSpacing,
              color: style.color,
              backgroundColor: style.backgroundColor,
              border: style.border,
              borderRadius: style.borderRadius,
              padding: style.padding,
              clipPath: `polygon(${polygon})`,
              transformOrigin: `${(x0 + x1) / 2}% ${(y0 + y1) / 2}%`,
            });
            layer.append(shard);
            const drift = (column - 1) * 75 + (Math.random() - 0.5) * 130;
            const spin = (Math.random() - 0.5) * 400;
            const lift = 75 + Math.random() * 95;
            const frames = Array.from({ length: 25 }, (_, i) => {
              const t = i / 24;
              return {
                offset: t,
                transform: `translate3d(${drift * t}px,${-lift * t + (fall + lift) * t * t}px,0) rotate(${spin * t}deg)`,
                opacity: t < 0.85 ? 1 : Math.max(0, (1 - t) / 0.15),
              };
            });
            animations.push(
              shard.animate(frames, {
                duration: 1450 + row * 90 + half * 45 + column * 35,
                easing: "linear",
                fill: "forwards",
              }),
            );
          }
        }
      }
      setBroken(true);
      timer = setTimeout(finish, 1800);
    } catch {
      finish();
    }
  }
  return (
    <button
      type="button"
      className={`shatter-tag${featured ? " featured" : ""}${broken ? " is-shattered" : ""}`}
      onClick={shatter}
      aria-disabled={broken}
      title="Нажмите — плашка рассыплется и восстановится"
    >
      {label}
    </button>
  );
}
