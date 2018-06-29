## Installation

You will need any simple HTTP server, e.g.: `npm install -g http-server`.

You will also need to follow instruction from `crawl-ar/` directory to build client-side JS API, since many of the clients here expect a symlink to `../crawl-ar/output/api.js` to exist.


## Starting the client

* `http-server` or `python -m SimpleHTTPServer 8080`
* Then open [localhost:8080/index.html](http://localhost:8080/index.html)

Tip: you can use [https://localtunnel.me](https://localtunnel.me) and its CLI `lt` (installed with `npm install -g localtunnel`) to make it easier to test from mobile device.

## Client types:

Interesting:

* `web-ar-search/`
  * This is an ugly 2d interface to publishing and consuming `ARArtifacts` using `api.js`.  Useful for testing.
* `maps-ar-browser/`
  * Automatically pin `ARArtifacts` near you to a Google Map.  No support for panning/searching, yet, [fake your geolocation using dev tools](https://developers.google.com/web/tools/chrome-devtools/device-mode/device-input-and-sensors) and refresh.

Less interesting:

* `ar-model-viewer/`
  * Early experiment: test displaying 3d model floating in "WebAR"
  * Copied from `three.ar.js` samples.
* `ar-world-browser/`
  * Early experiment: test displaying 2d DOM content floating in "WebAR".
* `geocode/`
  * Early experiment: using geolocation ONLY as a means to anchor content
