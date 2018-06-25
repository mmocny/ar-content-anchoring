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
    ret.push('file://' + path.join(root,filename));
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

async function addToSitemap(uri) {
  await datastore.sitemap.push(uri);
}

/******************************************************************************/

async function main() {
  await datastore.sitemap.remove();
  await addToSitemap('http://www.google.com');
  await addToSitemap('http://www.youtube.com');
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

module.exports.addToSitemap = addToSitemap;

/******************************************************************************/
