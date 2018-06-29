## Install

`npm install` to fetch dependancies, then `npm start`.

`npm link` to install `webar-ca` CLI tool locally.

## `extract` Command

If you run `webar-ca extract [URL or PATH]`, it will go through the following:

* Fetch the URL or PATH
* Extract all JSON+LD, including fetches to `<link rel=alternate>`
* Print out all discovered DataFeed, ArArtifacts, and Landmarks

## `sample` Command

If you run `webar-ca sample`, it will go through the following pipeline of tasks:

* Fetch a list of URLs to crawl from Firebase, known as the `sitemap`.
  * Append a list of files to crawl from local disk, by default just from `data/sample-sites/` directory   Useful for testing, or offline iteration.
* Fetch the raw HTML content of these URLs & Files, and extract all `application/ld+json` blocks.
  * Does not currently fetch externally hosted document (e.g. `<script src=... />`).  Only supports inline JSON-LD blocks.
* Parse JSONLD to filter out anything that isn't a (valid) ARArtifact.
  * Currently this is done poorly and manually, working on integrating a full `@context` spec and real json-ld validation.
* Parser currently splits valid ARArtifacts up by "key" type, e.d. Address vs Geolocation.  This may move to become the role of the indexer.
* Indexer adds ARArtifacts to index, stored in Firebase, based on "key" type.
  * The only currently supported key type is `GeoCoordinates`.

## Build web client JS API

* From `api/` directory, run `webpack` (or `webpack --watch`) to generate `output/api.js`
* You can then include the generated client API on your website `<script src="...output/api.js"></script>`
* By default, `api.js` will expose the following interesting functions:
  * `window.sitemap.addToSitemap(URI)`
  * `window.indexer.addByGeolocation({ latitude, longitude, uri, filename, jsonld })`
  * `window.indexer.lookupByGeolocation({ latitude, longitude, radius })`
  * and Class: `window.indexer.AnchorTracker`

## Using client JS API, with the realtime AnchorTracker

You can find sample usages (in varying states of readiness) in the `clients/` directory of this repo.  `web-ar-search` is simplest and most complete.

```
anchorTracker = new indexer.AnchorTracker();
anchorTracker.start();

anchorTracker.on('anchor_found', (jsonld) => {
  // jsonld is in the form that was added to the index in the first place.
  // e.g.:
  let contentUrl = jsonld.asset.widget;
});
anchorTracker.on('anchor_lost', (jsonld) => {
});
anchorTracker.on('anchor_moved', (jsonld) => {
});

anchorTracker.update({ latitude, longitude, radius: 5000 });
```

## See current state of index

[Firebase console](https://firebase.corp.google.com/u/0/project/ar-anchoring-prototype/database/ar-anchoring-prototype/data)
