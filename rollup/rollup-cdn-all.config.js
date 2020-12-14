import path from 'path';
import {
  babelPlugin,
  clearPlugin,
  importMetaUrlAssetsPlugin,
  inputs,
  shimMoment,
  shimShadyRender,
  terserPlugin,
} from './rollup-common.js';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { depsCachePlugin } from './rollup-plugin-deps-cache.js';

const MIN_JS = 'MIN_JS';
const MIN_HTML_CSS = 'MIN_HTML_CSS';
const MIN_SVG = 'MIN_SVG';
const TREESHAKE = 'TREESHAKE';
const NO_SOURCEMAP = 'NO_SOURCEMAP';
const PRESERVE_MODULES = 'PRESERVE_MODULES';
const SHIM_UNUSED = 'SHIM_UNUSED';
const MANUAL_CHUNKS = 'MANUAL_CHUNKS';
const HOIST_IMPORTS = 'HOIST_IMPORTS';
const DEPS_CACHE = 'DEPS_CACHE';

const splitInputs = inputs('src', (file) => {
  const { name } = path.parse(file);
  return [name, file];
});

splitInputs['setup-english'] = 'src/setup-english.js';

const manualChunkOptions = (id) => {
  const isSmall = id.endsWith('src/lib/events.js')
    || id.endsWith('src/styles/skeleton.js')
    || id.endsWith('src/styles/waiting.js')
    || id.endsWith('lit-html/directives/if-defined.js')
    || id.endsWith('lit-html/directives/class-map.js');
  if (isSmall) {
    return 'vendor';
  }
};

const treeshakeOptions = {
  moduleSideEffects: (id, external) => {
    const relativeId = path.relative(process.cwd(), id);
    const isComponent = /^src\/.+\/cc-[a-z-]+\.js$/.test(relativeId);
    const isEntryPoint = /^src\/[a-z-]+\.js$/.test(relativeId);
    // TODO: fix conflict with Leaflet.heat
    const isLeaflet = /^node_modules\/leaflet/.test(relativeId);
    return isComponent || isEntryPoint || isLeaflet;
  },
};

export function config (outputDir, input, options = []) {

  const minJs = options.includes(MIN_JS);
  const minHtmlCss = options.includes(MIN_HTML_CSS);
  const minSvg = options.includes(MIN_SVG);
  const sourcemap = !options.includes(NO_SOURCEMAP);
  const treeshake = options.includes(TREESHAKE);
  const preserveModules = options.includes(PRESERVE_MODULES);
  const shimUnused = options.includes(SHIM_UNUSED);
  const manualChunks = options.includes(MANUAL_CHUNKS);
  const hoistTransitiveImports = options.includes(HOIST_IMPORTS);
  const depsCache = options.includes(DEPS_CACHE);

  return {
    input,
    output: {
      dir: outputDir,
      sourcemap,
      // assetFileNames: '[name]-[hash].[ext]',
      manualChunks: manualChunks ? manualChunkOptions : false,
      hoistTransitiveImports,
    },
    treeshake: treeshake ? treeshakeOptions : false,
    preserveModules,
    plugins: [
      clearPlugin({ outputDir }),
      importMetaUrlAssetsPlugin({ optimize: minSvg }),
      json(),
      minJs && terserPlugin(),
      minHtmlCss && babelPlugin(),
      shimUnused && shimMoment(),
      shimUnused && shimShadyRender(),
      depsCache && depsCachePlugin(),
      // teaches Rollup how to find external modules (bare imports)
      resolve(),
      // convert CommonJS modules to ES6, so they can be included in a Rollup bundle
      commonjs(),
    ],
  };
}

export default [

  // Season 1: The mega fat bundle
  // Episode 101: small code to parse
  config('dist-cdn-all/custom-config-all-bundle-raw', { 'all-bundle': 'src/all.js' }, []),
  config('dist-cdn-all/custom-config-all-bundle-min-js', { 'all-bundle': 'src/all.js' }, [MIN_JS]),
  config('dist-cdn-all/custom-config-all-bundle-min-js-html-css', { 'all-bundle': 'src/all.js' }, [MIN_JS, MIN_HTML_CSS]),
  config('dist-cdn-all/custom-config-all-bundle-min-js-html-css-svg', { 'all-bundle': 'src/all.js' }, [MIN_JS, MIN_HTML_CSS, MIN_SVG]),
  // Episode 102: less data to parse
  config('dist-cdn-all/custom-config-all-bundle-treeshake-min-js-html-css-svg', { 'all-bundle': 'src/all.js' }, [MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE]),
  config('dist-cdn-all/custom-config-all-bundle-treeshake-english-min-js-html-css-svg', { 'all-bundle': 'src/all-en.js' }, [MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE]),
  config('dist-cdn-all/custom-config-all-bundle-treeshake-english-shim-min-js-html-css-svg', { 'all-bundle': 'src/all-en.js' }, [MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE, SHIM_UNUSED]),
  // Episode 103: small data to transfer
  // => gzip and brotli are done via server config
  // Episode 104: load data quickly
  // => HTTP/2 is done via server config

  // Season 2: Components à la carte with ES modules
  config('dist-cdn-all/custom-config-split-raw', splitInputs, [PRESERVE_MODULES]),
  // Episode 201: small code to parse
  config('dist-cdn-all/custom-config-split-min-js', splitInputs, [PRESERVE_MODULES, MIN_JS]),
  config('dist-cdn-all/custom-config-split-min-js-html-css', splitInputs, [PRESERVE_MODULES, MIN_JS, MIN_HTML_CSS]),
  config('dist-cdn-all/custom-config-split-min-js-html-css-svg', splitInputs, [PRESERVE_MODULES, MIN_JS, MIN_HTML_CSS, MIN_SVG]),
  // Episode 202: less data to parse
  config('dist-cdn-all/custom-config-split-treeshake-min-js-html-css-svg', splitInputs, [PRESERVE_MODULES, MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE]),
  config('dist-cdn-all/custom-config-split-treeshake-shim-min-js-html-css-svg', splitInputs, [PRESERVE_MODULES, MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE, SHIM_UNUSED]),
  // Episode 203: small data to transfer
  // => gzip and brotli are done via server config
  // Episode 204: load data quickly
  // => HTTP/2 is done via server config
  config('dist-cdn-all/custom-config-split-treeshake-shim-chunks-min-js-html-css-svg', splitInputs, [MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE, SHIM_UNUSED]),
  config('dist-cdn-all/custom-config-split-treeshake-shim-chunks-manual-min-js-html-css-svg', splitInputs, [MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE, SHIM_UNUSED, MANUAL_CHUNKS]),
  config('dist-cdn-all/custom-config-split-treeshake-shim-chunks-manual-hoist-1-min-js-html-css-svg', splitInputs, [MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE, SHIM_UNUSED, MANUAL_CHUNKS, HOIST_IMPORTS]),
  config('dist-cdn-all/custom-config-split-treeshake-shim-chunks-manual-hoist-2-min-js-html-css-svg', splitInputs, [MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE, SHIM_UNUSED, MANUAL_CHUNKS, DEPS_CACHE]),
  config('dist-cdn-all/custom-config-split-treeshake-shim-chunks-manual-hoist-3-min-js-html-css-svg', splitInputs, [MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE, SHIM_UNUSED, MANUAL_CHUNKS, DEPS_CACHE]),
  config('dist-cdn-all/custom-config-split-treeshake-shim-chunks-manual-hoist-4-min-js-html-css-svg', splitInputs, [MIN_JS, MIN_HTML_CSS, MIN_SVG, TREESHAKE, SHIM_UNUSED, MANUAL_CHUNKS, DEPS_CACHE]),
];
