/******************************************************************************/

async function sample() {
  /* What are we going to index? */
  let sitemap = require('./lib/sitemap');
  let sites = [].concat(
    await sitemap.forLocalTesting(),
    await sitemap.forRemoteTesting()
  );

  /* Lets fetch (or open) the HTML and extract JSON-LD */
  let crawler = require('./lib/crawler');
  let crawl_results = await crawler.crawl(sites);

  /* Set up a simple ArArtifacts JSON-LD parser */
  const Parser = require('./lib/parser');
  let parser = new Parser();

  /* And set up an index for specific anchor types */
  let indexer = require('./lib/firebase_indexer');

  /* Listen to parser events, update index as needed */
  parser.on('data-feed', async(params) => {
    console.log(JSON.stringify(params.datafeed, function (k, v) { return k ? "" + v : v; }, 2));
  });
  parser.on('ar-artifact', async(params) => {
    console.log(JSON.stringify(params.arartifact, function (k, v) { return k ? "" + v : v; }, 2));
  });
  parser.on('anchor-address', async(params) => {
    console.log(JSON.stringify(params, function (k, v) { return k ? "" + v : v; }));
    try {
      await indexer.addByAddress(ARtifact);
    } catch (ex) {
      console.error(ex);
    }
  });
  parser.on('anchor-geolocation', async(params) => {
    console.log(JSON.stringify(params, function (k, v) { return k ? "" + v : v; }));
    try {
      await indexer.addByGeolocation(ARtifact);
    } catch (ex) {
      console.error(ex);
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

/******************************************************************************/

module.exports.sample = sample;
