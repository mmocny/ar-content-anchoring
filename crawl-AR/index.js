/* Hello! */

/******************************************************************************/

global.__basedir = __dirname;

/******************************************************************************/

async function main() {
  /* What are we going to index? */
  let sitemap = require('./lib/sitemap');
  let sites = [].concat(await sitemap.forLocalTesting(), await sitemap.forRemoteTesting());

  /* Lets fetch (or open) the HTML and extract JSON-lD */
  let crawler = require('./lib/crawler');
  let crawl_results = await crawler.crawl(sites);

  /* Set up a simple ArArtifacts JSON-LD parser */
  const Parser = require('./lib/parser');
  let parser = new Parser();

  /* And set up an index for specific anchor types */
  let indexer = require('./lib/firebase_indexer');

  /* Listen to parser events, update index as needed */
  parser.on('data-feed', async() => {
  });
  parser.on('ar-artifact', async() => {
  });
  parser.on('anchor-address', async(root_ld, node_ld) => {
    try {
      await indexer.addByAddress(ARtifact);
    } catch (ex) {
      console.error(ex.stack || ex);
    }
  });
  parser.on('anchor-geolocation', async() => {
    try {
      await indexer.addByGeolocation(ARtifact);
    } catch (ex) {
      console.error(ex.stack || ex);
    }
  });

  /* Now ask parser to parse all the crawled jsonld */
  for (crawl_result of crawl_results) {
    try {
      parser.parse(crawl_result.jsonld);
    } catch(ex) {
      console.error("Parser Error:", ex.message);
    };
  }

  /* Finally, make a test search */
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
