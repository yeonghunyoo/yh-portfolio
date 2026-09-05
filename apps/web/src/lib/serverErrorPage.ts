/**
 * 500 page behaviour — `copyLog` and `reload` of the design export.
 *
 * The log block shows the timestamp and path of the visit that failed, so both are
 * filled in on the client; the markup ships with them empty rather than baking a
 * build-time value into a page that is served to everyone.
 */
import { ServerErrorCopy } from "../content/systemCopy";
import { initSystemPage } from "./systemPage";

const COPIED_FOR_MS = 1600;

function stamp(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function logText(now: string, path: string): string {
  return [
    `// error.log · ${now}`,
    "status: 500",
    `path: ${path}`,
    `message: ${ServerErrorCopy.logMessage}`,
    `hint: ${ServerErrorCopy.logHint}`,
  ].join("\n");
}

export function initServerErrorPage(): void {
  const now = stamp();
  const path = window.location.pathname || "/";
  const nowNode = document.querySelector("[data-log-now]");
  const pathNode = document.querySelector("[data-log-path]");
  if (nowNode) nowNode.textContent = now;
  if (pathNode) pathNode.textContent = path;

  let restore: ReturnType<typeof setTimeout> | undefined;

  initSystemPage({
    reload: () => window.location.reload(),
    copyLog: (_event, element) => {
      const done = (): void => {
        element.textContent = ServerErrorCopy.copied;
        clearTimeout(restore);
        restore = setTimeout(() => {
          element.textContent = ServerErrorCopy.copy;
        }, COPIED_FOR_MS);
      };
      const text = logText(now, path);
      // Clipboard access can be denied or missing; the label still confirms the click.
      if (navigator.clipboard) void navigator.clipboard.writeText(text).then(done, done);
      else done();
    },
  });
}
