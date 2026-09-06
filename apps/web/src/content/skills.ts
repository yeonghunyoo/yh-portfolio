/**
 * Seed data of the resume screen — the `skills` list the prototype loops over
 * (`<sc-for list="{{ skills }}" as="s">`) and the per-career skill sets its
 * `dimA/dimB/dimC` bindings are computed from.
 *
 * Trimmed from the export's nineteen. Git · JIRA · Zeplin · Figma came out because
 * they are table stakes or process tools that say nothing about engineering, and
 * MVVM · MVP because a list of patterns reads as filler. Kotlin and TypeScript came
 * in because the site claims Android native work and a Workers/Hono backend, and had
 * no skill backing either.
 */

export const Skills = [
  "Swift",
  "Kotlin (Compose)",
  "Dart",
  "Flutter",
  "TypeScript",
  "Python",
  "RxSwift",
  "Snapkit",
  "CoreData",
  "Firebase",
  "Supabase",
  "Cloudflare Workers",
  "OpenAPI",
  "MCP",
  "Fastlane",
].map((name) => ({ name }));

/** Which skills each career entry used — drives `dimA` / `dimB` / `dimC`. */
export type CareerKey = "dimA" | "dimB" | "dimC";

export const CareerSkills: Record<CareerKey, readonly string[]> = {
  dimA: ["Swift", "RxSwift", "Snapkit", "Fastlane"],
  dimB: ["Swift", "Dart", "Flutter", "Firebase", "Snapkit", "CoreData"],
  dimC: ["Swift", "CoreData"],
};
