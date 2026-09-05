import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@generated": fileURLToPath(new URL("../../shared/generated", import.meta.url)),
      "@design-assets": fileURLToPath(new URL("../../design/assets", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    passWithNoTests: false,
  },
});
