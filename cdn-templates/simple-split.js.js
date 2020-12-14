import { hoistImportDepsFirst, serveContent, unindent } from '../cdn-server/server-utils.js';

export const PATH_REGEX = /^\/custom-config-([a-z0-9-]*)\/simple-split\.js$/;

export function applyTemplate (context) {
  if (!context.requestUrl.pathname.match(PATH_REGEX)) {
    return;
  }
  const content = renderContent(context);
  return serveContent(context, content, 'application/javascript');
}

function renderContent (context) {

  const pathname = context.requestUrl.pathname;
  const pathToFile = (path, component) => pathname.includes('chunks')
    ? `./${component}.js`
    : `./src/${path}${component}.js`;

  const shouldHoistImportJsDeps = pathname.includes('hoist-2') || pathname.includes('hoist-3') || pathname.includes('hoist-4');

  if (shouldHoistImportJsDeps) {
    return hoistImportDepsFirst(['setup-english', 'cc-input-text', 'cc-tcp-redirection-form'], pathname);
  }

  // language=JavaScript
  return unindent`
    import '${pathToFile('', 'setup-english')}';
    import '${pathToFile('atoms/', 'cc-input-text')}';
    import '${pathToFile('tcp-redirections/', 'cc-tcp-redirection-form')}';
  `;
}
