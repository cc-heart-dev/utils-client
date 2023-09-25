import tsConfig from './tsconfig.json' assert { type: 'json' }
import typescript from '@rollup/plugin-typescript'

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
  plugins: [typescript(tsConfig)],
}
