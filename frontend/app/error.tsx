"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="wrap" style={{ padding: "100px 0" }}>
      <h1 style={{ fontSize: 40 }}>Не удалось загрузить сайт</h1>
      <p>Сервер временно недоступен. Попробуйте ещё раз.</p>
      <button className="button" onClick={reset}>
        Повторить
      </button>
    </main>
  );
}
