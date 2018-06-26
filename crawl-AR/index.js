/* Hello! */

/******************************************************************************/

global.__basedir = __dirname;

/******************************************************************************/

async function main() {
  let sitemap = require('./lib/sitemap');
  let sites = [].concat(await sitemap.forLocalTesting()/*, await sitemap.forRemoteTesting()*/);

  let crawler = require('./lib/crawler');
  let jsonld_blocks = await crawler.crawl(sites);

  let parser = require('./lib/parser');
  let ARtifacts = await parser.parse(jsonld_blocks);

  let indexer = require('./lib/firebase_indexer');
  for (let ARtifact of ARtifacts.byAddress) {
    try {
      await indexer.addByAddress(ARtifact);
    } catch (ex) {
      //console.error(ex.stack || ex);
    }
  }
  for (let ARtifact of ARtifacts.byGeolocation) {
    try {
      await indexer.addByGeolocation(ARtifact);
    } catch (ex) {
      console.error(ex.stack || ex);
    }
  }

  let result = await indexer.lookupByGeolocation({
    longitude: 74,
    latitude: 40.7,
    radius: 50000 // 50km
  });
  console.log(result);
}

if (!module.parent) {
  main().catch((ex) => {
    console.error(ex.stack || ex);
  }).then(() => {
    try {
      const Firebase = require('firebase');
      Firebase.database().goOffline();
    } catch (ex) { /* We may not have actually started FB, catching the error */ }
  });
}

/******************************************************************************/
