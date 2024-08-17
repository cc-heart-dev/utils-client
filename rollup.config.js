import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { readFileSync } from 'fs'

let tsConfig = readFileSync('./tsconfig.json')
tsConfig = JSON.parse(tsConfig)
tsConfig.compilerOptions.declaration = false

export default {
  input: 'index.ts',
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
  ],
  plugins: [resolve(), commonjs(), typescript(tsConfig)],
}
