const EventEmitter = require('events');

/******************************************************************************/
class ParserError extends Error {};

/*
 * Parser accepts a jsonld block and will walk its tree emitting events
 * whenever if finds a new DataFeed, ArArtifact, or certain types of Anchors
 *
 * Each event will include references to the root jsonld original provided,
 * as well as the enclosing DataFeed or ArArtifact if applicable.
 *
 * TODO: parsing is done using simple JSON lookup and not using a JSON-LD library
 * as I was unable to get the `jsonld` library working well (install time compile issues).
 * As such, parsing is not enforcing correct formatting, does not support case insensitivity,
 * does not do even simple transformations etc.  Only perfectly formed inputs work.
 *
 * TODO: Events refer only back to a single root artifact or datafeed.  While the parser
 * does support nested DataFeeds, you will not know about grandparent DataFeeds from
 * fired events.
 *
 * */
class Parser extends EventEmitter {
  parse(jsonld) {
    this._parseUnknown(jsonld, { root: jsonld });
  }

  _parseUnknown(jsonld, params) {
    if (!('@type' in jsonld)) {
      console.warn("Json-ld does not contain @type");
      return;
    }

    let type = jsonld['@type']

    if (typeof type !== 'string') {
      console.warn("Json-ld @type is not string");
      return;
    }

    type = type.toLowerCase().trim();

    switch (type) {
      case "datafeed":
        this._parseDataFeed(Object.assign(params, { datafeed: jsonld }));
        break;

      case "arartifact":
        this._parseArArtifact(Object.assign(params, { arartifact: jsonld }));
        break;

      default:
        break; // We ignore syntax we don't understand, and move on
    }
  }

  _parseDataFeed(params) {
    let { root, datafeed } = params;

    this.emit('data-feed', Object.assign({}, params));

    for (let dataFeedElement of (datafeed["dataFeedElement"] || [])) {
      this._parseUnknown(dataFeedElement, params);
    }
  }

  _parseArArtifact(params) {
    let { root, datafeed, arartifact } = params;

    this.emit('ar-artifact', params);
  }

  _parseLandmark(params) {
    let { root, datafeed, arartifact, landmark } = params;

    // http://schema.org/GeoCoordinates
    let { address, addressCountry, elevation, latitude, longitude, postalCode } = nearby;

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    if (latitude && longitude) {
      // Optional elevation
      // types are Number or Text
      ret.byGeolocation.push({
        uri,
        filename,
        latitude,
        longitude,
        elevation,
        jsonld
      });
    }

    if (address) {
      // Optional addressCountry, postalCode
      // types are Text or http://schema.org/PostalAddress
      ret.byAddress.push({
        uri,
        filename,
        address,
        addressCountry,
        postalCode,
        jsonld
      });
    }
  }

  _parseAsset(rootld, nodeld) {
  }
}

/******************************************************************************/

async function main() {
  parser = new Parser();
  parser.parse({});
}

if (!module.parent) {
  main()
}

/******************************************************************************/

module.exports = exports = Parser;
module.exports.ParserError = ParserError;

/******************************************************************************/

