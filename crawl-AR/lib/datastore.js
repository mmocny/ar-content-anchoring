const Firebase = require('firebase');
const GeoFire = require('geofire');

/******************************************************************************/

const config = {
  apiKey: "",
  databaseURL: "https://ar-anchoring-prototype.firebaseio.com"
};

Firebase.initializeApp(config);
const fb = Firebase.database().ref();

const geoIndex = new GeoFire(fb.child('geoindex'));
const artifacts = fb.child('artifacts');
const sitemap = fb.child('sitemap');

/******************************************************************************/

module.exports.geoIndex = geoIndex;
module.exports.artifacts = artifacts;
module.exports.sitemap = sitemap;

/******************************************************************************/

