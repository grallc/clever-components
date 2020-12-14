import http from 'http';
import mime from 'mime-types';
import { cacheControl, ONE_YEAR } from 'hititipi/src/middlewares/cache-control.js';
import { chainAll } from 'hititipi/src/middlewares/chain-all.js';
import { chainUntilResponse } from 'hititipi/src/middlewares/chain-until-response.js';
import { contentEncoding } from 'hititipi/src/middlewares/content-encoding.js';
import { contentLength } from 'hititipi/src/middlewares/content-length.js';
import { cors } from 'hititipi/src/middlewares/cors.js';
import { hititipi } from 'hititipi/src/hititipi.js';
import { keepAlive } from 'hititipi/src/middlewares/keep-alive.js';
import { logRequest } from 'hititipi/src/middlewares/log-request.js';
import { notModified } from 'hititipi/src/middlewares/not-modified.js';
import { optionsDashboard } from 'hititipi/src/middlewares/options-dashboard.js';
import { pathOptions } from 'hititipi/src/middlewares/path-options.js';
import { socketId } from 'hititipi/src/middlewares/socket-id.js';
import { staticFile } from 'hititipi/src/middlewares/static-file.js';

import * as indexHtml from '../cdn-templates/index.html.js';
import * as simpleHtml from '../cdn-templates/simple.html.js';
import * as simpleSplitJs from '../cdn-templates/simple-split.js.js';
import * as multipleHtml from '../cdn-templates/multiple.html.js';
import * as multipleJs from '../cdn-templates/multiple.js.js';
import * as multipleNbJs from '../cdn-templates/multiple-nb.js.js';

// Thank you rollup
mime.types['js_commonjs-proxy'] = 'application/javascript';
mime.types['json_commonjs-proxy'] = 'application/javascript';

// TODO: one config for normal and one config for CDN
http
  .createServer(
    hititipi(
      logRequest(
        chainAll([
          (context) => {
            const requestUrlWithOptions = context.requestUrl;
            return { ...context, requestUrlWithOptions };
          },
          pathOptions(),
          optionsDashboard(),
          socketId(),
          (context) => keepAlive({
            max: context.pathOptions.get('kam'),
            timeout: context.pathOptions.get('kat'),
          }),
          chainUntilResponse([
            indexHtml.applyTemplate,
            simpleHtml.applyTemplate,
            simpleSplitJs.applyTemplate,
            multipleHtml.applyTemplate,
            multipleJs.applyTemplate,
            multipleNbJs.applyTemplate,
            staticFile({ root: 'dist-cdn-all' }),
          ]),
          (context) => {
            const cc = (context.pathOptions.get('cc') || '').split(',');
            return cacheControl({
              'public': cc.includes('pu'),
              'private': cc.includes('pv'),
              'no-cache': cc.includes('nc'),
              'no-store': cc.includes('ns'),
              'must-revalidate': cc.includes('mr'),
              'proxy-revalidate': cc.includes('pr'),
              'immutable': cc.includes('i'),
              'no-transform': cc.includes('nt'),
              'max-age': cc.includes('may') ? ONE_YEAR : cc.includes('maz') ? 0 : null,
              's-maxage': cc.includes('smay') ? ONE_YEAR : cc.includes('smaz') ? 0 : null,
              'stale-while-revalidate': cc.includes('swry') ? ONE_YEAR : null,
              'stale-if-error': cc.includes('siey') ? ONE_YEAR : null,
            });
          },
          cors({
            allowOrigin: '*',
          }),
          (context) => contentEncoding({
            gzip: context.pathOptions.get('ce') === 'gz',
            brotli: context.pathOptions.get('ce') === 'br',
          }),
          (context) => context.pathOptions.get('cl') === '1' ? contentLength : null,
          (context) => notModified({
            etag: context.pathOptions.get('et') === '1',
            lastModified: context.pathOptions.get('lm') === '1',
          }),
          (context) => {
            if (context.responseStatus == null) {
              return { ...context, responseStatus: 404 };
            }
          },
        ]),
      ),
    ),
  )
  .listen(8080);
