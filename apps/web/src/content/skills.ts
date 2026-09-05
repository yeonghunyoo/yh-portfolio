/**
 * Seed data of the resume screen — the `skills` list the prototype loops over
 * (`<sc-for list="{{ skills }}" as="s">`) and the per-career skill sets its
 * `dimA/dimB/dimC` bindings are computed from. Copied verbatim from the design
 * export's component script; the names are product names, so strings.json gave
 * them no Strings key.
 */

export const Skills = [
  "Swift",
  "Dart",
  "Flutter",
  "Python",
  "Firebase",
  "Supabase",
  "Cloudflare Workers",
  "RxSwift",
  "MVVM",
  "MVP",
  "Snapkit",
  "CoreData",
  "Fastlane",
  "OpenAPI",
  "MCP",
  "Zeplin",
  "Figma",
  "JIRA",
  "Git",
].map((name) => ({ name }));

/** Which skills each career entry used — drives `dimA` / `dimB` / `dimC`. */
export type CareerKey = "dimA" | "dimB" | "dimC";

export const CareerSkills: Record<CareerKey, readonly string[]> = {
  dimA: ["Swift", "RxSwift", "MVVM", "Snapkit", "Fastlane", "Zeplin", "Figma", "JIRA", "Git"],
  dimB: ["Swift", "Dart", "Flutter", "Firebase", "MVVM", "Snapkit", "CoreData", "Figma", "JIRA", "Git"],
  dimC: ["Swift", "MVP", "CoreData", "Git"],
};
