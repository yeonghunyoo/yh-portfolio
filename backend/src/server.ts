import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { API_BASE_PATH, handleRequest } from "./http/router.ts";
import { getViewsStore } from "./store/factory.ts";

/**
 * Local dev server. Production serves the same handlers as Astro endpoints on Vercel
 * (see src/astro/*) — this exists so the routes can be exercised without the web app.
 *   VIEWS_STORE_DRIVER=memory node --experimental-strip-types src/server.ts
 */
const PORT = Number(process.env.PORT ?? 4321);

function toRequest(req: IncomingMessage, body: Buffer): Request {
  const host = req.headers.host ?? `localhost:${PORT}`;
  const url = new URL(req.url ?? "/", `http://${host}`);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  const method = (req.method ?? "GET").toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD" && body.length > 0;
  return new Request(url, {
    method,
    headers,
    body: hasBody ? new Uint8Array(body) : undefined,
  });
}

async function send(response: Response, res: ServerResponse): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}

const server = createServer((req, res) => {
  const chunks: Buffer[] = [];
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  req.on("end", () => {
    void (async () => {
      try {
        const request = toRequest(req, Buffer.concat(chunks));
        const response = await handleRequest(request, { store: getViewsStore(process.env) });
        await send(response, res);
      } catch {
        res.statusCode = 500;
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ code: "store_unavailable", message: "internal error" }));
      }
    })();
  });
});

server.listen(PORT, () => {
  console.log(`views API listening on http://localhost:${PORT}${API_BASE_PATH}/views`);
});
