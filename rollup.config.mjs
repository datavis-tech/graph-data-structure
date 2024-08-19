import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import ts from 'rollup-plugin-ts';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    plugins: [nodeResolve(), ts({ tsconfig: 'tsconfig.json' }), terser()],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
    },
    plugins: [nodeResolve(), ts({ tsconfig: 'tsconfig.json' }), terser()],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'graphDataStructure',
    },
    plugins: [nodeResolve(), ts({ tsconfig: 'tsconfig.json' }), terser()],
  },
];
