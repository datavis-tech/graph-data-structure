import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import ts from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

const runtimePlugins = () => [nodeResolve(), ts(), terser()];
const dtsPlugins = () => [
  nodeResolve(),
  ts({ compilerOptions: { sourceMap: false } }),
  dts(),
];

export default [
  // Bundle runtime
  {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    plugins: runtimePlugins(),
  },
  {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      file: 'dist/index.mjs',
      format: 'esm',
    },
    plugins: runtimePlugins(),
  },
  {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'graphDataStructure',
    },
    plugins: runtimePlugins(),
  },

  // Bundle types definitions
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/index.d.cts', format: 'cjs' }],
    plugins: dtsPlugins(),
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/index.d.mts', format: 'esm' }],
    plugins: dtsPlugins(),
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/index.umd.d.ts', format: 'umd' }],
    plugins: dtsPlugins(),
  },
];
