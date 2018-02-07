const EventEmitter = require('events');

const datastore = require('./datastore');

/******************************************************************************/

const geoIndex = datastore.geoIndex;
const artifacts = datastore.artifacts;

/******************************************************************************/

function getKeyFromPayload(uri, jsonld) {
  // TODO: Improve this
  // Note: Firebase key cannot contain any of the following characters: . # $ ] [ /
  return [uri, jsonld.asset.widget].join("|").replace(/[\.\#\$\]\[\/]/g, "?");
}

/******************************************************************************/

async function addByGeolocation({ latitude, longitude, uri, filename, jsonld } = {}) {
  // TODO: validate inputs
  let key = getKeyFromPayload(uri || filename, jsonld);

  await Promise.all([
    geoIndex.set(key, [latitude, longitude]),
    artifacts.child(key).set(payload)
  ]);
}

/******************************************************************************/

async function lookupByGeolocation({ latitude, longitude, radius } = {}) {
  let geoQuery = geoIndex.query({
    center: [latitude, longitude],
    radius: radius // meters
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

// This will emit events:
// - 'anchor_found'
// - 'anchor_lost'
// - 'anchor_moved'
class AnchorTracker extends EventEmitter {

  start({ latitude, longitude, radius }) {
    this.geoQuery = geoIndex.query({
      center: [0, 0],
      radius: 0
    });
    this.update({ latitude, longitude, radius });

    this.geoQuery.on("key_entered", async (key, location) => {
      let snapshot = await artifacts.child(key).once('value');
      let jsonld = snapshot.val();
      this.emit('anchor_found', jsonld);
    });

    this.geoQuery.on("key_exited", function(key, location) {
      let snapshot = await artifacts.child(key).once('value');
      let jsonld = snapshot.val();
      this.emit('anchor_lost', jsonld);
    });

    this.geoQuery.on("key_moved", function(key, location) {
      console.log(key + " moved to somewere else within the query.");
      let snapshot = await artifacts.child(key).once('value');
      let jsonld = snapshot.val();
      this.emit('anchor_moved', jsonld);
    });
  }

  update(longitude, latitude, radius) {
    this.geoQuery.updateCriteria({
      center: [latitude, longitude],
      radius: radius
    });
  }

  stop() {
    this.geoQuery.cancel();
  }
};

/******************************************************************************/

async function createanchorTracker() {
  let geoQuery = geoIndex.query({
    center: [0, 0],
    radius: 0
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

async function main() {
}

if (!module.parent) {
  main()
}

/******************************************************************************/

module.exports.addByGeolocation = addByGeolocation;
module.exports.lookupByGeolocation = lookupByGeolocation;

module.exports.AnchorTracker = AnchorTracker;

/******************************************************************************/

