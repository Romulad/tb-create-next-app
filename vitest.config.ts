import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    globalSetup: "./__tests__/lib/setup.ts",
    testTimeout: 50000,
    mockReset: true,
  },
});
