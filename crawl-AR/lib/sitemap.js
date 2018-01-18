/* Returns a list of URI, or a objects in the form npm package `crawler` expects */

const fs = require('fs');
const path = require('path');
const util = require('util');

const datastore = require('./datastore');

/******************************************************************************/

async function forLocalTesting() {
  let ret = [];

  let root = path.join(global.__basedir, 'data/sample-sites');
  let filenames = await util.promisify(fs.readdir)(root);

  for (let filename of filenames) {
    filename = path.join(root,filename);
    let content = await util.promisify(fs.readFile)(filename, 'utf-8');
    let crawlArgs = {
      html: content, // crawl supports inline HTML
      filename // also attach the filename for easier debugging
    };
    ret.push(crawlArgs);
  }

  return ret;
}

/******************************************************************************/

async function forRemoteTesting() {
  let ret = [];

  let snapshot = await datastore.sitemap.once('value');
  snapshot.forEach((child) => {
    let uri = child.val();
    ret.push(uri);
  });

  return ret;
}

/******************************************************************************/

async function forLive() {
  // TODO
}

/******************************************************************************/

async function main() {
  await datastore.sitemap.remove();
  await datastore.sitemap.push('http://www.google.com');
  await datastore.sitemap.push('http://www.youtube.com');
}

if (!module.parent) {
  main().catch((ex) => {
    console.error(ex.stack || ex);
  });;
}

/******************************************************************************/

module.exports.forLocalTesting = forLocalTesting;
module.exports.forRemoteTesting = forRemoteTesting;
module.exports.forLive = forLive;

/******************************************************************************/
