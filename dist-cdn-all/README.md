# About smart CDN

## unpkg

* No support for "exports" maps
* ESM is opt-in with ?module
* We need to refer to /dist/...
* Images work (because of the /dist...)
* Some component fail when a dependency is not ESM (because we put ?module everywhere)
  * cc-input-text because of "clipboard-copy"
  * cc-tile-requests & cc-tile-status-codes because of "statuses"

## skypack

* ESM works by default
* We need to refer to /dist/...
* Images work (because of the /dist...)
* Weird bug on multiple with lit-html
* seems to auto-add polyfills if necessary

## jspm

* there's a "lag" between publication on npm and availability
