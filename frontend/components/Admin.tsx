"use client";
import { useEffect, useState } from "react";
import type { Content, Project, Skill } from "../lib/content";
import EditorNavigation from "./admin/EditorNavigation";
import ProjectEditor from "./admin/ProjectEditor";
import ThemeToggle from "./ThemeToggle";
const emptySkill: Skill = {
  title: "Новая категория",
  description: "",
  items: [],
};
const emptyProject: Project = {
  title: "Новый проект",
  category: "",
  description: "",
  details: "",
  tags: [],
  url: "",
  demo: "",
};
async function api(path: string, method = "GET", body?: unknown) {
  const r = await fetch("/api/" + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const d = await r.json();
  if (!r.ok) throw Error(d.error || "Ошибка сервера");
  return d;
}
export default function Admin() {
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState<Content | null>(null),
    [password, setPassword] = useState(""),
    [status, setStatus] = useState(""),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [ready, setReady] = useState(false);
  useEffect(() => {
    api("session")
      .then(async (s) => {
        if (s.authenticated) setData(await api("content"));
      })
      .catch((e) => setStatus(e.message))
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    addEventListener("beforeunload", fn);
    return () => removeEventListener("beforeunload", fn);
  }, [dirty]);
  useEffect(() => {
    for (const id of ["editor-skills", "editor-projects"]) {
      const cards = document.querySelectorAll<HTMLDetailsElement>(
        `#${id} details.editor-card`,
      );
      const last = cards[cards.length - 1];
      if (
        last &&
        /Новая категория|Новый проект/.test(
          last.querySelector("summary strong")?.textContent || "",
        )
      )
        last.open = true;
    }
  }, [data?.skills.length, data?.projects.length]);
  function change(next: Content) {
    setData(next);
    setDirty(true);
  }
  function updateSkill(i: number, key: keyof Skill, value: string | string[]) {
    if (data)
      change({
        ...data,
        skills: data.skills.map((s, n) =>
          n === i ? { ...s, [key]: value } : s,
        ),
      });
  }
  function updateProject(
    i: number,
    key: keyof Project,
    value: string | string[],
  ) {
    if (data)
      change({
        ...data,
        projects: data.projects.map((p, n) =>
          n === i ? { ...p, [key]: value } : p,
        ),
      });
  }
  function move(kind: "skills" | "projects", i: number, delta: number) {
    if (!data) return;
    const arr = [...data[kind]];
    const j = i + delta;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    change({ ...data, [kind]: arr });
  }
  function remove(kind: "skills" | "projects", i: number) {
    if (
      data &&
      confirm("Удалить элемент? Изменение применится после сохранения.")
    )
      change({ ...data, [kind]: data[kind].filter((_, n) => n !== i) });
  }
  const toolbar = (kind: "skills" | "projects", i: number) => (
    <div className="item-toolbar">
      <button
        type="button"
        aria-label="Переместить выше"
        disabled={i === 0}
        onClick={() => move(kind, i, -1)}
      >
        ↑
      </button>
      <button
        type="button"
        aria-label="Переместить ниже"
        disabled={i === (data?.[kind].length || 0) - 1}
        onClick={() => move(kind, i, 1)}
      >
        ↓
      </button>
      <button type="button" onClick={() => remove(kind, i)}>
        Удалить
      </button>
    </div>
  );
  function backup() {
    if (!data) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-backup.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <main className="admin-shell">
      <header>
        <a href="/" target="_blank">
          DARCHIEV / Редактор
        </a>
        <ThemeToggle />
      </header>
      <p className="editor-status" role="status" aria-live="polite">
        {status}
      </p>
      {!ready ? (
        <p>Загрузка…</p>
      ) : !data ? (
        <section id="auth">
          <h1>Вход в редактор</h1>
          <p>Используйте пароль ADMIN_PASSWORD, заданный при первом запуске.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await api("login", "POST", { password });
                setPassword("");
                setData(await api("content"));
                setStatus("Вы вошли в редактор.");
              } catch (e) {
                setStatus((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              Пароль
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button disabled={busy || uploading}>Войти</button>
          </form>
        </section>
      ) : (
        <>
          <fieldset
            className="editor-controls editor-savebar"
            disabled={uploading || busy}
          >
            <div className="toolbar">
              <span className={`save-indicator ${dirty ? "is-dirty" : ""}`}>
                {uploading
                  ? "Загрузка изображения…"
                  : busy
                    ? "Сохранение…"
                    : dirty
                      ? "Есть несохранённые изменения"
                      : "Все изменения сохранены"}
              </span>
              <a href="/" target="_blank">
                Посмотреть сайт ↗
              </a>
              <button className="primary" form="content-form" disabled={busy}>
                {busy
                  ? "Сохраняю…"
                  : uploading
                    ? "Загружаю фото…"
                    : "Сохранить изменения"}
              </button>
            </div>
          </fieldset>
          <div className="editor-layout">
            <EditorNavigation
              skills={data.skills.length}
              projects={data.projects.length}
            />
            <div className="editor-content">
              <form
                id="content-form"
                onInvalidCapture={(e) => {
                  const el = e.target as HTMLElement;
                  const card = el.closest("details");
                  if (card) card.open = true;
                  requestAnimationFrame(() => {
                    el.scrollIntoView({ block: "center" });
                    el.focus();
                  });
                }}
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBusy(true);
                  try {
                    await api("content", "PUT", data);
                    setDirty(false);
                    setStatus("Сохранено в PostgreSQL.");
                  } catch (e) {
                    setStatus((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <fieldset
                  className="editor-controls"
                  disabled={uploading || busy}
                >
                  <section className="panel" id="editor-about">
                    <h2>Обо мне</h2>
                    <p className="section-help">
                      Короткое представление на первом экране и подробный
                      рассказ о вас ниже.
                    </p>
                    <label>
                      Первый экран
                      <textarea
                        maxLength={3000}
                        required
                        value={data.summary}
                        onChange={(e) =>
                          change({ ...data, summary: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Биография: абзацы с новой строки
                      <textarea
                        value={data.bio.join("\n")}
                        onChange={(e) =>
                          change({ ...data, bio: e.target.value.split("\n") })
                        }
                      />
                    </label>
                  </section>
                  <section className="panel" id="editor-skills">
                    <div className="section-title">
                      <h2>
                        Навыки <small>{data.skills.length}</small>
                      </h2>
                      <button
                        type="button"
                        onClick={() =>
                          change({
                            ...data,
                            skills: [...data.skills, { ...emptySkill }],
                          })
                        }
                      >
                        + Категория
                      </button>
                    </div>
                    <p className="section-help">
                      Откройте категорию для редактирования. Стрелки меняют
                      порядок на сайте.
                    </p>
                    {data.skills.length === 0 && (
                      <p className="empty-state">
                        Пока нет категорий. Добавьте первую кнопкой выше.
                      </p>
                    )}
                    {data.skills.map((s, i) => (
                      <details className="item editor-card" key={i}>
                        <summary>
                          <span>
                            <strong>{s.title || "Без названия"}</strong>
                            <small>
                              {s.items.filter(Boolean).length} технологий
                            </small>
                          </span>
                          <span className="card-edit">Редактировать</span>
                        </summary>
                        <div className="editor-card-body">
                          {toolbar("skills", i)}
                          <label>
                            Название
                            <input
                              maxLength={100}
                              required
                              value={s.title}
                              onChange={(e) =>
                                updateSkill(i, "title", e.target.value)
                              }
                            />
                          </label>
                          <label>
                            Описание
                            <input
                              maxLength={500}
                              value={s.description}
                              onChange={(e) =>
                                updateSkill(i, "description", e.target.value)
                              }
                            />
                          </label>
                          <label>
                            Навыки через запятую
                            <input
                              value={s.items.join(",")}
                              onChange={(e) =>
                                updateSkill(
                                  i,
                                  "items",
                                  e.target.value.split(","),
                                )
                              }
                            />
                          </label>
                        </div>
                      </details>
                    ))}
                  </section>
                  <section className="panel" id="editor-projects">
                    <div className="section-title">
                      <h2>
                        Проекты <small>{data.projects.length}</small>
                      </h2>
                      <button
                        type="button"
                        onClick={() =>
                          change({
                            ...data,
                            projects: [...data.projects, { ...emptyProject }],
                          })
                        }
                      >
                        + Проект
                      </button>
                    </div>
                    <p className="section-help">
                      В каждой карточке — тексты, ссылки, технологии, обложка и
                      логотип.
                    </p>
                    {data.projects.length === 0 && (
                      <p className="empty-state">
                        Пока нет проектов. Добавьте первую работу кнопкой выше.
                      </p>
                    )}
                    {data.projects.map((p, i) => (
                      <details className="item editor-card" key={i}>
                        <summary>
                          <span>
                            <strong>{p.title || "Без названия"}</strong>
                            <small>
                              {p.category || "Категория не указана"}
                            </small>
                          </span>
                          <span className="card-edit">Редактировать</span>
                        </summary>
                        <div className="editor-card-body">
                          {toolbar("projects", i)}
                          <ProjectEditor
                            p={p}
                            onChange={(key, value) =>
                              updateProject(i, key, value)
                            }
                            onBusy={setUploading}
                          />
                        </div>
                      </details>
                    ))}
                  </section>
                </fieldset>
              </form>
              <section className="panel" id="editor-tools">
                <h2>Копии и выход</h2>
                <p className="section-help">
                  Скачайте тексты и настройки перед крупными изменениями. Копия
                  JSON содержит ссылки на фото; сами изображения хранятся на
                  сервере.
                </p>
                <fieldset
                  className="editor-controls"
                  disabled={busy || uploading}
                >
                  <div className="editor-tools">
                    {" "}
                    <button onClick={backup}>Скачать копию</button>
                    <label className="import">
                      Загрузить копию
                      <input
                        type="file"
                        accept=".json"
                        hidden
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          try {
                            if (!file) return;
                            if (file.size > 150000)
                              throw Error("Файл слишком большой");
                            const d = JSON.parse(await file.text());
                            if (
                              typeof d.summary !== "string" ||
                              !Array.isArray(d.bio) ||
                              !d.bio.every(
                                (x: unknown) => typeof x === "string",
                              ) ||
                              !Array.isArray(d.skills) ||
                              !d.skills.every(
                                (s: Skill) =>
                                  s &&
                                  typeof s.title === "string" &&
                                  typeof s.description === "string" &&
                                  Array.isArray(s.items) &&
                                  s.items.every((x) => typeof x === "string"),
                              ) ||
                              !Array.isArray(d.projects) ||
                              !d.projects.every(
                                (p: Project) =>
                                  p &&
                                  [
                                    "title",
                                    "category",
                                    "description",
                                    "details",
                                    "url",
                                    "demo",
                                  ].every(
                                    (k) =>
                                      typeof p[k as keyof Project] === "string",
                                  ) &&
                                  Array.isArray(p.tags) &&
                                  p.tags.every((x) => typeof x === "string"),
                              )
                            )
                              throw Error("Некорректная копия");
                            change(d);
                            setStatus(
                              "Копия загружена. Сохраните, чтобы применить.",
                            );
                          } catch (e) {
                            setStatus((e as Error).message);
                          } finally {
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                    <button
                      onClick={async () => {
                        if (dirty && !confirm("Выйти без сохранения?")) return;
                        try {
                          await api("logout", "POST", {});
                          setData(null);
                          setDirty(false);
                          setStatus("Вы вышли.");
                        } catch (e) {
                          setStatus((e as Error).message);
                        }
                      }}
                    >
                      Выйти
                    </button>
                  </div>
                </fieldset>
              </section>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
