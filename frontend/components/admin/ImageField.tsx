"use client";
import { useState } from "react";
export default function ImageField({
  label,
  value,
  onChange,
  onBusy,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  onBusy: (busy: boolean) => void;
}) {
  const [error, setError] = useState("");
  return (
    <div className="image-field">
      <label>
        {label}
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setError("");
            if (file.size > 5 * 1024 * 1024) {
              setError("Максимум 5 МБ");
              return;
            }
            onBusy(true);
            try {
              const r = await fetch("/api/media", {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
              });
              const d = await r.json();
              if (!r.ok) throw Error(d.error || "Ошибка загрузки");
              onChange(d.url);
            } catch (err) {
              setError((err as Error).message);
            } finally {
              onBusy(false);
            }
          }}
        />
      </label>
      {value && (
        <>
          <img src={value} alt={label} />
          <button type="button" onClick={() => onChange("")}>
            Убрать изображение
          </button>
        </>
      )}
      <small>
        JPEG / PNG · до 5 МБ. После загрузки нажмите «Сохранить изменения».
      </small>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
