import pkg from './package.json'
import rpi_jsy from 'rollup-plugin-jsy-babel'
import {minify} from 'uglify-es'
import {uglify as rpi_uglify} from 'rollup-plugin-uglify'

const sourcemap = 'inline'
const plugins = [rpi_jsy()]

const ugly = { warnings: true, output: {comments: false, max_line_len: 256}}
const prod_plugins = plugins.concat([
  rpi_uglify(ugly, minify),
])

const external = []

export default [
	{ input: 'code/index.jsy',
		output: [
      { file: 'esm/index.js', format: 'es', sourcemap },
      { file: 'cjs/index.js', format: 'cjs', sourcemap, exports: 'named' },
    ],
    external, plugins },

	{ input: 'code/node.jsy',
		output: [
      { file: 'esm/node.js', format: 'es', sourcemap },
      { file: 'cjs/node.js', format: 'cjs', sourcemap, exports: 'named' },
      { file: pkg.main, format: 'cjs', sourcemap, exports: 'named' },
    ],
    external, plugins },

	{ input: 'code/browser.jsy',
		output: [
      { file: 'esm/browser.js', format: 'es', sourcemap },
      { file: 'umd/index.js', format: 'umd', name: pkg.name, sourcemap, exports: 'named' },
      { file: pkg.browser, format: 'umd', name: pkg.name, sourcemap, exports: 'named' },
    ],
    external, plugins },
].filter(e=>e)
