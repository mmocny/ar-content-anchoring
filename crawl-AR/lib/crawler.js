const URL = require('url').URL;
const fetch = require('node-fetch');
const fs = require('fs');
const util = require('util');

const Crawler = require("crawler");
const promisifyEmitter = require("./promisifyEmitter");

/******************************************************************************/

async function fetch_from_disk(filename) {
  let content = await util.promisify(fs.readFile)(filename, 'utf-8');
  return content;
}

/******************************************************************************/

/*
 * Crawl the selected URI, then return all the JSON-LD markup contained.
 *
 * TODO: Should probably return the raw HTML here, and have something else extract JSON-LD markup -- but we do it here because we have easy access to DOM from Crawler library.
 */
async function crawl(urls) {
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
      //console.log(">> About to Crawl url: [", options.uri, "] with", Object.keys(options.headers).length, "headers");
      done();
    },

    callback(error, res, done) {
      (async() => { // Async IIFE
        let options = res.options;

        if (!options.uri && options.html) {
          //console.log(">> Crawled file: [", options.filename ,"]");
        } else {
          //console.log(">> Crawled uri: [", options.uri ,"], with status code:", options.statusCode);
        }

        if (error){
          console.error(error);
          return done();
        }

        let $ = res.$;

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

        let jsonld_links = $("link[rel='alternate'][type='application/ld+json'][href]").toArray();
        for (let link of jsonld_links) {

          let url = new URL(link.attribs.href);
          if (url.protocol == 'file:') {
            let jsonld = JSON.parse(await fetch_from_disk(url.pathname));
            ret.push({
              filename: url,
              jsonld
            });
          } else {
            let jsonld = JSON.parse(await fetch(url));
            ret.push({
              uri: url,
              jsonld
            });
          }

        }

        done();
      })();
    }
  });

  for (url of urls.map((url) => new URL(url))) {
    if (url.protocol == 'file:') {
      c.queue({
        html: await fetch_from_disk(url.pathname),
        filename: url,
      });
    } else {
      c.queue({
        uri: url
      });
    }
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
