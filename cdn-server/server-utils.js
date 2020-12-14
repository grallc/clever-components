import { Readable } from 'stream';
import { getStrongEtagHash } from 'hititipi/src/lib/etag.js';
import { depCache } from '../dist-cdn-all/custom-config-split-treeshake-shim-chunks-manual-hoist-2-min-js-html-css-svg/depcache.js';

export function serveContent (context, content, contentType) {
  const responseStatus = 200;
  const responseBody = Readable.from(content);
  const responseSize = content.length;
  const responseEtag = getStrongEtagHash(content);
  const responseHeaders = {
    ...context.responseHeaders,
    'content-type': contentType,
  };
  return { ...context, responseStatus, responseHeaders, responseBody, responseSize, responseEtag };
}

const { CDN_ORIGIN = 'http://cdn.localhost:8080' } = process.env;
const cdnUrl = new URL(CDN_ORIGIN);

export function useCdnOrigin (relativePath, url) {
  const newUrl = new URL(relativePath, url);
  newUrl.protocol = cdnUrl.protocol;
  newUrl.hostname = cdnUrl.hostname;
  newUrl.port = cdnUrl.port;
  return newUrl.toString();
}

export function unindent (strings, ...holes) {
  let strBuffer = '';
  for (let i = 0; i < strings.length; i += 1) {
    strBuffer += strings[i];
    if (holes[i] !== undefined) {
      strBuffer += holes[i];
    }
  }

  const lines = strBuffer
    .replace(/^\n/, '')
    .replace(/\n *$/, '')
    .split('\n');

  const allIndents = lines
    .map((l) => {
      return (l === '') ? null : l.match(/^( *).*$/)[1].length;
    })
    .filter((a) => a != null);
  const minIndent = Math.min(...allIndents);

  return lines
    .map((line) => line.substr(minIndent))
    .join('\n');
}

export function hoistImportDepsFirst (componentNameList, pathname) {
  const staticImport = pathname.includes('hoist-2');
  const dynamicImport = pathname.includes('hoist-3') || pathname.includes('hoist-4');
  const preloadSvg = pathname.includes('hoist-4');
  const allDeps = componentNameList
    .map((componentName) => componentName + '.js')
    .flatMap((filename) => [...depCache[filename], filename]);
  return Array
    .from(new Set(allDeps))
    .map((filename) => {
      const isi18n = filename.includes('i18n') || filename.includes('translations.') || filename.includes('setup-');
      if (filename.endsWith('.svg') && preloadSvg) {
        return `(new Image()).src = new URL('./${filename}', import.meta.url).href;`;
      }
      if (filename.endsWith('.js') && (staticImport || isi18n)) {
        return `import './${filename}';`;
      }
      if (filename.endsWith('.js') && dynamicImport && !isi18n) {
        return `import('./${filename}');`;
      }
    })
    .filter((a) => a != null)
    .join('\n');
}
