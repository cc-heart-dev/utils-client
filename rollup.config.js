import tsConfig from "./tsconfig.json" assert { type: "json" };
import typescript from "@rollup/plugin-typescript";

tsConfig.compilerOptions.declaration = false;

export default {
  input: "index.ts",
  output: [
    {
      file: "dist/esm/index.js",
      format: "esm",
    },
    {
      file: "dist/cjs/index.cjs",
      format: "cjs",
    },
  ],
  plugins: [typescript(tsConfig)],
};
