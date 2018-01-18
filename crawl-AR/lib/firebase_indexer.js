const datastore = require('./datastore');

/******************************************************************************/

const geoIndex = datastore.geoIndex;
const artifacts = datastore.artifacts;

/******************************************************************************/

function getKeyFromPayload(uri, payload) {
  // TODO: Improve this
  // Note: Firebase key cannot contain any of the following characters: . # $ ] [ /
  return [uri, payload.asset.widget].join("|").replace(/[\.\#\$\]\[\/]/g, "?");
}

async function addToIndex(lat, lon, uri, payload) {
  let key = getKeyFromPayload(uri, payload);
  console.log(key);
  await Promise.all([
    geoIndex.set(key, [lat, lon]),
    artifacts.child(key).set(payload)
  ]);
}

async function lookupInIndex(lat, lon, radius_in_meters) {
  let geoQuery = geoIndex.query({
    center: [lat, lon],
    radius: radius_in_meters
  });

  let keys = [];
  await new Promise((resolve, reject) => {
    geoQuery.on("key_entered", function(key, location) {
      keys.push(key);
    });

    // Disable GeoQuery after its done loading results:
    geoQuery.on("ready", function() {
      geoQuery.cancel();
      resolve();
    });
  });

  let payloads = [];
  for (let key of keys) {
    let snapshot = await artifacts.child(key).once('value');
    let jsonld = snapshot.val();
    payloads.push(jsonld);
  }

  return payloads;
}

/******************************************************************************/

async function addByAddress(params) {
  //console.log("addByAddress:", JSON.stringify(params, null, 4));
  // TODO: find a way to map addresses to geolocations
}

/******************************************************************************/

async function addByGeolocation(params) {
  //console.log("addByGeolocation:", JSON.stringify(params, null, 4));

  await addToIndex(params.latitude, params.longitude, params.uri || params.filename, params.jsonld);
}

/******************************************************************************/

async function lookupByAddress(params) {
  //console.log("lookupByAddress:", JSON.stringify(params, null, 4));
}

/******************************************************************************/

async function lookupByGeolocation(params) {
  //console.log("lookupByGeolocation:", JSON.stringify(params, null, 4));

  return await lookupInIndex(params.latitude, params.longitude, params.radius);
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

