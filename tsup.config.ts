import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  outDir: "dist",
  platform: "node",
  target: "node24",
  bundle: true,
  splitting: false,
  clean: true,
  noExternal: [/.*/],
});
