import pkg from './package.json'
import rpi_jsy from 'rollup-plugin-jsy-babel'

const sourcemap = 'inline'
const plugins = [rpi_jsy()]

const external = ['ec-pem', 'crypto', 'url']

export default [
	{ input: 'code/index.jsy',
		output: [
      { file: 'esm/index.js', format: 'es', sourcemap },
      { file: pkg.module, format: 'es', sourcemap },
      { file: 'cjs/index.js', format: 'cjs', sourcemap, exports: 'named' },
      { file: pkg.main, format: 'cjs', sourcemap, exports: 'named' },
    ],
    external, plugins },
].filter(e=>e)
