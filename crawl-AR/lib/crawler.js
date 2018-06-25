const fs = require('fs');
const util = require('util');
const URL = require('url').URL;

const promisifyEmitter = require("./promisifyEmitter");
const Crawler = require("crawler");

/******************************************************************************/

async function fetch_from_disk(filename) {
  let content = await util.promisify(fs.readFile)(filename, 'utf-8');
  return content;
}

/******************************************************************************/

/*
 * Crawl the selected URI, then return all the JSON-LD markup contained.
 *
 */
async function crawl(urls) {
  urls = urls.map((url) => new URL(url));
  let ret = [];

  // TODO: as-is, this creates a new crawler for each new call to crawl().
  // Would be better if we have a single crawler object which queues more
  // input values each time.  Would have to change crawler to generate events
  // each time a new page is crawled rather than returning the full set of
  // results back at the end of computation.
  let c = new Crawler({
    maxConnections : 2,
    //rateLimit: 1000, // ms between crawls?
    timeout: 15000, // ms

    // preRequest is not called for raw HTML
    preRequest(options, done) {
      console.log(">> About to Crawl url: [", options.uri, "] with", Object.keys(options.headers).length, "headers");
      done();
    },

    callback(error, res, done) {
      let options = res.options;

      if (!options.uri && options.html) {
        console.log(">> Crawled file: [", options.filename ,"]");
      } else {
        console.log(">> Crawled uri: [", options.uri ,"], with status code:", options.statusCode);
      }

      if (error){
        console.error(error);
        return done();
      }

      let $ = res.$;
      console.log('Grabbed', res.body.length, 'bytes');

      // TODO replace this with a query for all JSON-LD
      // Attach the URI/filename to it as well
      let jsonld_tags = $("script[type='application/ld+json']").toArray();
      for (let tag of jsonld_tags) {
        try {
          let jsonld = JSON.parse(tag.children[0].data);

          ret.push({
            uri: options.uri,
            filename: options.filename,
            attribs: tag.attribs,
            jsonld
          });
        } catch(ex) {
          console.error(ex);
        }
      }

      done();
    }
  });

  for (url of urls) {
    let param = url;

    if (url.protocol == 'file:') {
      param = {
        html: await fetch_from_disk(url.pathname),
        filename: url,
      };
    }
    c.queue(param);
  }

  // Stall the crawl function return until after the crawl drains the queue
  await promisifyEmitter(c, 'drain');

  return ret;
}

/******************************************************************************/

async function main() {
  await crawl(['http://www.google.com/']);
}

if (!module.parent) {
  main()
}

/******************************************************************************/

module.exports.crawl = crawl;

/******************************************************************************/
