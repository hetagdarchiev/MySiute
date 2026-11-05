"use client";
import { useEffect, useState } from "react";

const portraits = [
  { src: "/portrait-hoodie.png", alt: "Хетаг в толстовке с принтом Гатса" },
  { src: "/portrait-business.png", alt: "Хетаг в графитовом костюме" },
  { src: "/portrait-workspace.png", alt: "Хетаг за компьютером" },
];

export default function PortraitSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motionOff, setMotionOff] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setMotionOff(
        query.matches ||
          document.documentElement.classList.contains("motion-off"),
      );
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    query.addEventListener("change", update);
    update();
    return () => {
      observer.disconnect();
      query.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (paused || motionOff) return;
    const id = setInterval(() => {
      if (!document.hidden && !document.documentElement.classList.contains("theme-wave"))
        setActive((index) => (index + 1) % portraits.length);
    }, 20_000);
    return () => clearInterval(id);
  }, [paused, motionOff, active]);
  return (
    <figure
      className="hero-photo photo-reveal portrait-slider"
      aria-label="Портреты Хетага"
      aria-roledescription="карусель"
    >
      {portraits.map((photo, index) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt + " — AI-портрет"}
          width="1024"
          height="1536"
          className={index === active ? "slide is-active" : "slide"}
          aria-hidden={index !== active}
          fetchPriority={index === 0 ? "high" : "low"}
        />
      ))}
      <figcaption>
        ХЕТАГ ДАРЧИЕВ{" "}
        <span>{String(active + 1).padStart(2, "0")} / ПОРТРЕТ</span>
      </figcaption>
      <div className="portrait-controls">
        <div className="portrait-dots" aria-label="Выбрать фотографию">
          {portraits.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              aria-label={photo.alt}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
        <button
          type="button"
          className="portrait-pause"
          onClick={() => setPaused(!paused)}
          disabled={motionOff}
          aria-label={
            paused ? "Продолжить смену фото" : "Приостановить смену фото"
          }
        >
          {paused || motionOff ? "▶" : "Ⅱ"}
        </button>
      </div>
    </figure>
  );
}
