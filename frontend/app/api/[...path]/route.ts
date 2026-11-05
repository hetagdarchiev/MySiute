import { NextRequest } from "next/server";
import { apiURL } from "../../../lib/content";
async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const media = path.join("/") === "media" || /^media\/[a-f0-9]{64}$/.test(path.join("/"));
  if (!media && !["content", "session", "login", "logout"].includes(path.join("/")))
    return Response.json({ error: "Not found" }, { status: 404 });
  if (
    !["GET", "HEAD"].includes(req.method) &&
    req.headers.get("origin") !==
      (process.env.PUBLIC_ORIGIN || "http://localhost:3000")
  )
    return Response.json(
      { error: "Недопустимый источник запроса" },
      { status: 403 },
    );
  try {
    let body: Uint8Array<ArrayBuffer> | undefined;
    if (!["GET", "HEAD"].includes(req.method) && req.body) {
      const reader = req.body.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > (media ? 5 * 1024 * 1024 : 150000)) {
          await reader.cancel();
          return Response.json({ error: "Запрос слишком большой" }, { status: 413 });
        }
        chunks.push(value);
      }
      body = new Uint8Array(Buffer.concat(chunks));
    }
    const response = await fetch(`${apiURL()}/api/${path.join("/")}`, {
      method: req.method,
      headers: {
        "Content-Type": req.headers.get("content-type") || "application/json",
        Cookie: req.headers.get("cookie") || "",
        Origin: req.headers.get("origin") || "",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const headers = new Headers({
      "Content-Type": response.headers.get("content-type") || "application/json",
      "Cache-Control": response.headers.get("cache-control") || "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    const cookie = response.headers.get("set-cookie");
    if (cookie) headers.set("Set-Cookie", cookie);
    return new Response(response.body, { status: response.status, headers });
  } catch {
    return Response.json(
      { error: "API недоступен. Проверьте Go-сервер и PostgreSQL." },
      { status: 503 },
    );
  }
}
export { proxy as GET, proxy as POST, proxy as PUT };
