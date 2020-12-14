import { hoistImportDepsFirst, serveContent, unindent } from '../cdn-server/server-utils.js';

export const PATH_REGEX = /^\/custom-config-([a-z0-9-]*)\/multiple-([a-z]+)\.js$/;

export function applyTemplate (context) {
  if (!context.requestUrl.pathname.match(PATH_REGEX)) {
    return;
  }
  const content = renderContent(context);
  return serveContent(context, content, 'application/javascript');
}

function renderContent (context) {

  const pathname = context.requestUrl.pathname;
  const pageNb = PATH_REGEX.exec(pathname)[2];

  const pathToFile = (path, component) => pathname.includes('chunks')
    ? `./${component}.js`
    : `./src/${path}${component}.js`;

  const shouldHoistImportJsDeps = pathname.includes('hoist-2') || pathname.includes('hoist-3') || pathname.includes('hoist-4');

  switch (pageNb) {

    case 'one':
      if (shouldHoistImportJsDeps) {
        return hoistImportDepsFirst(['cc-toggle', 'cc-img'], pathname);
      }
      // language=JavaScript
      return unindent`
        import '${pathToFile('atoms/', 'cc-toggle')}';
        import '${pathToFile('atoms/', 'cc-img')}';
      `;

    case 'two':
      if (shouldHoistImportJsDeps) {
        return hoistImportDepsFirst(['setup-english', 'cc-env-var-form'], pathname);
      }
      // language=JavaScript
      return unindent`
        import '${pathToFile('', 'setup-english')}';
        import '${pathToFile('env-var/', 'cc-env-var-form')}';
      `;

    case 'three':
      if (shouldHoistImportJsDeps) {
        return hoistImportDepsFirst([
          'setup-english',
          'cc-tile-instances',
          'cc-tile-scalability',
          'cc-tile-deployments',
          'cc-tile-consumption',
          'cc-tile-requests',
          'cc-tile-status-codes',
          'cc-logsmap',
        ], pathname);
      }
      // language=JavaScript
      return unindent`
        import '${pathToFile('', 'setup-english')}';
        import '${pathToFile('overview/', 'cc-tile-instances')}';
        import '${pathToFile('overview/', 'cc-tile-scalability')}';
        import '${pathToFile('overview/', 'cc-tile-deployments')}';
        import '${pathToFile('overview/', 'cc-tile-consumption')}';
        import '${pathToFile('overview/', 'cc-tile-requests')}';
        import '${pathToFile('overview/', 'cc-tile-status-codes')}';
        import '${pathToFile('maps/', 'cc-logsmap')}';
      `;
  }

  return ``;
}
