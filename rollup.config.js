import tsConfig from "./tsconfig.json" assert { type: "json" };
import typescript from "@rollup/plugin-typescript";

tsConfig.compilerOptions.declarationDir = './types';
tsConfig.compilerOptions.declaration = false
console.log(tsConfig);
export default {
  input: "index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
    },
  ],
  plugins: [typescript(tsConfig)],
};