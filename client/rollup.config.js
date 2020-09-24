import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import autoPreprocess from 'svelte-preprocess';
import config from 'sapper/config/rollup.js';
import rootImport from 'rollup-plugin-root-import';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) => {
	if (warning.code == 'THIS_IS_UNDEFINED')
		return;
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);
};

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess: autoPreprocess({
					scss: {}
				}),
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			json(),

			rootImport({
				// Will first look in `client/src/*` and then `common/src/*`.
				root: `${__dirname}/src`,
				useInput: 'prepend',
		  
				// If we don't find the file verbatim, try adding these extensions
				extensions: ['.js', '.svelte'],
			}),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				generate: 'ssr',
				dev
			}),
			resolve({
				dedupe: ['svelte']
			}),
			rootImport({
				// Will first look in `client/src/*` and then `common/src/*`.
				root: `${__dirname}/src`,
				useInput: 'prepend',
		  
				// If we don't find the file verbatim, try adding these extensions
				extensions: ['.js', '.svelte'],
			}),
			json(),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

		preserveEntrySignatures: 'strict',
		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			rootImport({
				// Will first look in `client/src/*` and then `common/src/*`.
				root: `${__dirname}/src`,
				useInput: 'prepend',
		  
				// If we don't find the file verbatim, try adding these extensions
				extensions: ['.js', '.svelte'],
			}),
			commonjs(),
			!dev && terser()
		],

		preserveEntrySignatures: false,
		onwarn,
	}
};
