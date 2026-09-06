/**
 * Seed data of the resume screen — the `skills` list the prototype loops over
 * (`<sc-for list="{{ skills }}" as="s">`) and the per-career skill sets its
 * `dimA/dimB/dimC` bindings are computed from.
 *
 * Trimmed from the export's nineteen down to what carries signal. Out came the table
 * stakes and process tools (Git · JIRA · Zeplin · Figma), the patterns (MVVM · MVP),
 * and then the service and library names the human judged to be noise
 * (Cloudflare Workers · OpenAPI · MCP · Supabase · Firebase · CoreData · Snapkit).
 * Kotlin and TypeScript went in because the site claims Android native work and a
 * TypeScript backend, and had no skill backing either.
 *
 * What is left is languages plus the two iOS tools that actually distinguish one
 * career entry from another.
 */

export const Skills = [
  "Swift",
  "Kotlin (Compose)",
  "Dart",
  "Flutter",
  "TypeScript",
  "Python",
  "RxSwift",
  "Fastlane",
].map((name) => ({ name }));

/** Which skills each career entry used — drives `dimA` / `dimB` / `dimC`. */
export type CareerKey = "dimA" | "dimB" | "dimC";

export const CareerSkills: Record<CareerKey, readonly string[]> = {
  dimA: ["Swift", "RxSwift", "Fastlane"],
  dimB: ["Swift", "Dart", "Flutter"],
  dimC: ["Swift"],
};
