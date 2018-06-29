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
 * Will find:
 *  <script type=application/ld+json>
 *  <link red=alternate type=application/ld+json href=>
 *
 * Input URLs must be absolute, and include protocol prefix.
 * Local files must be in form file:///Path/Name
 */
async function crawl(urls) {
  let ret = [];

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

        // TODO: Consider supporting src=, like <link href=>

        // Parse inline JSON+LD content
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

        // Fetch <link>s to JSON+LD
        let jsonld_links = $("link[rel='alternate'][type='application/ld+json'][href]").toArray();
        for (let link of jsonld_links) {

          let url = new URL(link.attribs.href, options.uri || options.filename); // Provide the original URL as base
          if (url.protocol == 'file:') {
            let content = await fetch_from_disk(url.pathname)
            let jsonld = JSON.parse(content);
            ret.push({
              filename: url,
              jsonld
            });
          } else {
            let response = await fetch(url);
            let content = await response.text();
            let jsonld = JSON.parse(content);
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
