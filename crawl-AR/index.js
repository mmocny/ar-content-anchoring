/* Hello! */

/******************************************************************************/

global.__basedir = __dirname;

/******************************************************************************/

async function main() {
  let sitemap = require('./lib/sitemap');
  let crawler = require('./lib/crawler');
  let parser = require('./lib/parser');

  //let indexer = require('./lib/indexer');
  let indexer = require('./lib/firebase_indexer');

  let sites = [].concat(await sitemap.forLocalTesting(), await sitemap.forRemoteTesting());
  let jsonld_blocks = await crawler.crawl(sites);

  let ARtifacts = await parser.parse(jsonld_blocks);

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
  });;
}

/******************************************************************************/
