const Geo = require('geo-nearby');

// TODO: Firebase database

/******************************************************************************/

const data = [];
let index = null;

function addToIndex(lat, lon, payload) {
  data.push([lat, lon, payload]);

  index = new Geo(Geo.createCompactSet(data), { sorted: true });
}

function lookupInIndex(lat, lon, radius_in_meters) {
  return index.nearBy(lat, lon, radius_in_meters).map((e) => e.i);
}

/******************************************************************************/

async function addByAddress(params) {
  //console.log("addByAddress:", JSON.stringify(params, null, 4));
  // TODO: find a way to map addresses to geolocations
}

/******************************************************************************/

async function addByGeolocation(params) {
  //console.log("addByGeolocation:", JSON.stringify(params, null, 4));

  addToIndex(params.latitude, params.longitude, params.jsonld);
}

/******************************************************************************/

async function lookupByAddress(params) {
  //console.log("lookupByAddress:", JSON.stringify(params, null, 4));
}

/******************************************************************************/

async function lookupByGeolocation(params) {
  //console.log("lookupByGeolocation:", JSON.stringify(params, null, 4));

  return lookupInIndex(params.latitude, params.longitude, params.radius);
}

/******************************************************************************/

async function main() {
}

if (!module.parent) {
  main()
}

/******************************************************************************/

module.exports.addByAddress = addByAddress;
module.exports.addByGeolocation = addByGeolocation;
module.exports.lookupByAddress = lookupByAddress;
module.exports.lookupByGeolocation = lookupByGeolocation;

/******************************************************************************/

