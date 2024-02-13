import tsConfig from './tsconfig.json' assert { type: 'json' }
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

tsConfig.compilerOptions.declaration = false

export default {
  input: 'index.ts',
  output: [
    {
      preserveModules: true,
      dir: 'dist/esm',
      format: 'esm',
    },
    {
      preserveModules: true,
      dir: 'dist/cjs',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
  ],
  plugins: [resolve(), commonjs(), typescript(tsConfig)],
}
