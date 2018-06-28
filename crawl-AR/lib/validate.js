const Parser = require('./parser');

/******************************************************************************/

/*
 * TODO: Call Parser, and set up events for everything
 * If there are any errors, then print the error
 */
async function validate(jsonld) {
  let parser = new Parser();
  parser.on('data-feed', async() => {
  });
  parser.on('ar-artifact', async() => {
  });
  parser.on('anchor-address', async(root_ld, node_ld) => {
  });
  parser.on('anchor-geolocation', async() => {
  });
}

/******************************************************************************/

async function main() {
  const path = require('path');
  const url = require('url');
  const crawler = require('./crawler');

  let args = process.argv.slice(2);
  let sites = args.map((arg) => {
    if (!url.parse(arg).protocol) { // TODO: how else to differentiate path's from URL?
      return "file://" + path.resolve(arg);
    }
    return arg;
  });

  console.log(sites);
  let crawl_results = await crawler.crawl(sites);
  console.log(crawl_results);

  for (crawl_result of crawl_results) {
    await validate(crawl_result.jsonld);
  }
}

if (!module.parent) {
  main()
}

/******************************************************************************/

module.exports.validate = validate;

/******************************************************************************/

