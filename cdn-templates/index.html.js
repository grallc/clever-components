import { serveContent } from '../cdn-server/server-utils.js';

const PATH_REGEX = /^\/$/;

export function applyTemplate (context) {
  if (context.requestUrl.pathname.match(PATH_REGEX)) {
    const content = renderContent(context);
    return serveContent(context, content, 'text/html');
  }
}

function renderContent (context) {

  return `

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Home</title>
  <link rel="stylesheet" href="./global-styles.css">
</head>
<body>

<h1>Web components, ES modules and smart CDNs - a web perf adventure...</h1>

<table>

  <tr>
    <td class="category" colspan="5">Season 1: The mega fat bundle</td>
  </tr>
  ${renderLine('Mega fat bundle (raw unminified)', 'custom-config-all-bundle-raw')}

  <tr>
    <td class="group" colspan="5">Episode 101: small code to parse</td>
  </tr>
  ${renderLine('Minify JavaScript', '/custom-config-all-bundle-min-js')}
  ${renderLine('Minify inlined HTML templates and CSS', '/custom-config-all-bundle-min-js-html-css')}
  ${renderLine('Minify SVG', '/custom-config-all-bundle-min-js-html-css-svg')}

  <tr>
    <td class="group" colspan="5">Episode 102: less data to parse</td>
  </tr>
  ${renderLine('Enable treeshaking', '/custom-config-all-bundle-treeshake-min-js-html-css-svg')}
  ${renderLine('Only load english', '/custom-config-all-bundle-treeshake-english-min-js-html-css-svg')}
  ${renderLine('Shim unused stuffs from 3rd parties', '/custom-config-all-bundle-treeshake-english-shim-min-js-html-css-svg')}

  <tr>
    <td class="group" colspan="5">Episode 103: small data to transfer</td>
  </tr>
  ${renderLine('Enable gzip', '/@ce=gz/custom-config-all-bundle-treeshake-english-shim-min-js-html-css-svg')}
  ${renderLine('Enable brotli', '/@ce=br/custom-config-all-bundle-treeshake-english-shim-min-js-html-css-svg')}

  <tr>
    <td class="group" colspan="5">Episode 104: load data quickly</td>
  </tr>
  ${renderLine('Enable HTTP/2', '/@ce=br/custom-config-all-bundle-treeshake-english-shim-min-js-html-css-svg')}

  <tr>
    <td class="category" colspan="5">Season 2: Components à la carte with ES modules</td>
  </tr>
  ${renderLine('Source individual ES modules (raw unminified)', 'custom-config-split-raw')}

  <tr>
    <td class="group" colspan="5">Episode 201: small code to parse</td>
  </tr>
  ${renderLine('Minify JavaScript', 'custom-config-split-min-js')}
  ${renderLine('Minify inlined HTML templates and CSS', 'custom-config-split-min-js-html-css')}
  ${renderLine('Minify SVG', 'custom-config-split-min-js-html-css-svg')}

  <tr>
    <td class="group" colspan="5">Episode 202: less data to parse</td>
  </tr>
  ${renderLine('Enable treeshaking', 'custom-config-split-treeshake-min-js-html-css-svg')}
  ${renderLine('Shim unused stuffs from 3rd parties', 'custom-config-split-treeshake-shim-min-js-html-css-svg')}

  <tr>
    <td class="group" colspan="5">Episode 203: small data to transfer</td>
  </tr>
  ${renderLine('Enable gzip', '/@ce=gz/custom-config-split-treeshake-shim-min-js-html-css-svg')}
  ${renderLine('Enable brotli', '/@ce=br/custom-config-split-treeshake-shim-min-js-html-css-svg')}

  <tr>
    <td class="group" colspan="5">Episode 204: load data quickly</td>
  </tr>
  ${renderTodo('Keep alive')}
  ${renderTodo('domain sharding')}
  ${renderLine('Enable HTTP/2', '/@ce=br/custom-config-split-treeshake-shim-min-js-html-css-svg')}
  ${renderLine('Code splitting (chunks)', '/@ce=br/custom-config-split-treeshake-shim-chunks-min-js-html-css-svg')}
  ${renderLine('Code splitting (manual chunks)', '/@ce=br/custom-config-split-treeshake-shim-chunks-manual-min-js-html-css-svg')}
  ${renderLine('Hoist imports (rollup system)', '/@ce=br/custom-config-split-treeshake-shim-chunks-manual-hoist-1-min-js-html-css-svg')}
  ${renderLine('Hoist imports (JS depcache reverse order)', '/@ce=br/custom-config-split-treeshake-shim-chunks-manual-hoist-2-min-js-html-css-svg')}
  ${renderLine('Hoist imports (JS depcache reverse order dynamic import)', '/@ce=br/custom-config-split-treeshake-shim-chunks-manual-hoist-3-min-js-html-css-svg')}
  ${renderLine('Hoist imports (JS depcache reverse order dynamic import + preload SVG)', '/@ce=br/custom-config-split-treeshake-shim-chunks-manual-hoist-4-min-js-html-css-svg')}
  ${renderTodo('Preload with Link header')}
  ${renderTodo('HTTP/2 push')}

  <tr>
    <td class="category" colspan="5">Online smart CDNs</td>
  </tr>
  ${renderLine('JSPM', './jspm')}
  ${renderLine('unpkg', './unpkg')}
  ${renderLine('Skypack', './skypack')}
  ${renderLine('First custom build with Clever Cloud\'s Cellar', './cellar-beta')}

</table>

</body>
</html>

`.trim();
}

const renderGroup = (groupTitle, pathPrefix) => `
<tr>
  <td class="group" colspan="5">${groupTitle}</td>
</tr>
${renderLine('-- no minification', pathPrefix + '-raw')}
${renderLine('-- minified JS', pathPrefix + '-min-js')}
${renderLine('-- minified JS + HTML + CSS', pathPrefix + '-min-js-html-css')}
${renderLine('-- minified JS + HTML + CSS + SVG', pathPrefix + '-min-js-html-css-svg')}
`;

const renderLine = (title, pathPrefix) => `
<tr>
  <td>${title}</td>
  <td><a href="${pathPrefix}/simple.html">simple</a></td>
  <td><a href="${pathPrefix}/multiple.html#one">multiple one</a></td>
  <td><a href="${pathPrefix}/multiple.html#two">multiple two</a></td>
  <td><a href="${pathPrefix}/multiple.html#three">multiple three</a></td>
</tr>
`;

const renderTodo = (title) => `
<tr>
  <td>${title}</td>
  <td>TODO</td>
  <td>TODO</td>
  <td>TODO</td>
  <td>TODO</td>
</tr>
`;
