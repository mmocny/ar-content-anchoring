/* Hello! */

/******************************************************************************/

global.__basedir = __dirname;

/******************************************************************************/

async function main() {
  let sitemap = require('./lib/sitemap');
  let sites = [].concat(await sitemap.forLocalTesting()/*, await sitemap.forRemoteTesting()*/);

  let crawler = require('./lib/crawler');
  let crawl_results = await crawler.crawl(sites);

  const Parser = require('./lib/parser');
  let parser = new Parser();
  let indexer = require('./lib/firebase_indexer');

  parser.on('data-feed', async() => {
    console.log('GOT DATAFEED EVENT');
  });
  parser.on('ar-artifact', async() => {
    console.log('GOT ARARTIFACT EVENT');
  });
  parser.on('anchor-address', async(root_ld, node_ld) => {
    console.log('GOT ANCHOR-ADDRESS EVENT');
    return;
    try {
      await indexer.addByAddress(ARtifact);
    } catch (ex) {
      //console.error(ex.stack || ex);
    }
  });
  parser.on('anchor-geolocation', async() => {
    console.log('GOT ANCHOR-GEOLOCATION EVENT');
    return;
    try {
      await indexer.addByGeolocation(ARtifact);
    } catch (ex) {
      console.error(ex.stack || ex);
    }
  });

  for (crawl_result of crawl_results) {
    await parser.parse(crawl_result.jsonld);
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
    } catch (ex) { } // We may not have actually started FireBase, catching the error
  });
}

/******************************************************************************/
