import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { Buffer } from 'node:buffer'
import { readFileSync, writeFileSync } from 'fs'
import { gzipSizeSync } from 'gzip-size'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))

export default {
  input: 'lib/index.js',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
    // UMD build for CDN/script-tag usage
    {
      file: 'dist/json-fields.umd.js',
      format: 'umd',
      name: 'JsonFields',
      sourcemap: true,
      exports: 'named',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'jsxRuntime',
      },
    },
    // Minified UMD filename (plugins already include terser)
    {
      file: 'dist/json-fields.umd.min.js',
      format: 'umd',
      name: 'JsonFields',
      sourcemap: true,
      exports: 'named',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'jsxRuntime',
      },
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { modules: false }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }),
    terser(),
    {
      name: 'emit-bundle-stats',
      generateBundle(outputOptions, bundle) {
        try {
          const files = []
          let totalRaw = 0
          let totalGzip = 0
          for (const [fileName, chunk] of Object.entries(bundle)) {
            if (chunk && 'code' in chunk) {
              const code = chunk.code || ''
              const rawBytes = Buffer.byteLength(code)
              const gzipBytes = gzipSizeSync(code)
              files.push({ fileName, rawBytes, gzipBytes })
              totalRaw += rawBytes
              totalGzip += gzipBytes
            }
          }
          const report = {
            generatedAt: new Date().toISOString(),
            files,
            totals: { rawBytes: totalRaw, gzipBytes: totalGzip },
          }
          writeFileSync('dist/bundle-stats.json', JSON.stringify(report, null, 2))
        } catch (e) {
          this.warn(`emit-bundle-stats failed: ${e?.message || e}`)
        }
      },
    },
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
}
