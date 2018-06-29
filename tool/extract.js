const URL = require('url').URL;

/******************************************************************************/

async function extract(urls) {
  /* What are we going to index? */
  let sites = [].concat(urls).map((url) => new URL(url, "file://"+process.cwd()+'/'));

  /* Lets fetch (or open) the HTML and extract JSON-LD */
  let crawler = require('./lib/crawler');
  let crawl_results = await crawler.crawl(sites);

  /* Set up a simple ArArtifacts JSON-LD parser */
  const Parser = require('./lib/parser');
  let parser = new Parser();

  /* Listen to parser events, update index as needed */
  parser.on('data-feed', async(params) => {
    console.log(JSON.stringify(params.datafeed, function (k, v) { return k ? "" + v : v; }, 2));
  });
  parser.on('ar-artifact', async(params) => {
    console.log(JSON.stringify(params.arartifact, function (k, v) { return k ? "" + v : v; }, 2));
  });
  parser.on('anchor-address', async(params) => {
    console.log(JSON.stringify(params, function (k, v) { return k ? "" + v : v; }));
  });
  parser.on('anchor-geolocation', async(params) => {
    console.log(JSON.stringify(params, function (k, v) { return k ? "" + v : v; }));
  });

  /* Now ask parser to parse all the crawled jsonld */
  for (crawl_result of crawl_results) {
    try {
      parser.parse(crawl_result.jsonld);
    } catch(ex) {
      console.error("Parser Error:", ex.message);
    };
  }
}

/******************************************************************************/

module.exports.extract = extract;
