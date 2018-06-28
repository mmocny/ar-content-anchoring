const EventEmitter = require('events');

/******************************************************************************/
class ParserError extends Error {};

class Parser extends EventEmitter {
  parse(jsonld) {
    if (!('@type' in jsonld)) {
      throw new ParserError("Json-ld does not contain @type");
    }

    let type = jsonld['@type']

    if (typeof type !== 'string') {
      throw new ParserError("Json-ld @type is not string");
    }

    type = type.toLowerCase().trim();

    switch (type) {
      case "datafeed":
        return this._parseDataFeed({
          root: jsonld,
          feed: jsonld,
        });

      case "arartifact":
        return this._parseArArtifact({
          root: jsonld,
          artifact: jsonld,
        });

      default:
        throw new Error("Json-ld does not contain DataFeed or ARArtifact");
    }
  }

  _parseDataFeed(params) {
    let { root, feed } = params;

    this.emit('data-feed', Object.assign({}, params));

    // TODO: iterate over datafeed items, call _parseArArtifact

  }

  _parseArArtifact(params) {
    let { root, feed, artifact } = params;

    this.emit('ar-artifact', params);
  }

  _parseLandmark(params) {
    let { root, feed, artifact, landmark } = params;

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

