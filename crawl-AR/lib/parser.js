/******************************************************************************/

/*
 * parse is given an array of objects in the form:
 *  {
 *    uri: "...",
 *    filename: "...",
 *    attribs: "...",
 *    jsonld: "...",
 *  }
 *
 *  We first verify that the jsonld is indeed in the form of an AR anchor (i.e.
 *  @type is "ARArtifact".
 *  We then extract the relevant metadata to be indexed for later.
 */
async function parse(objects) {
  //console.log("parse:", JSON.stringify(params, null, 4));

  let ret = {
    byAddress: [],
    byGeolocation: []
  };

  for (let o of objects) {
    let { uri, filename, attribs, jsonld } = o;

    if (typeof jsonld !== "object") continue;

    let { type, nearby, asset } = jsonld;
    type = jsonld["@type"];

    if (typeof type !== "string" || type.toLowerCase().localeCompare("arartifact") != 0)
      continue;

    if (typeof nearby === "object") {
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

    // TODO: extra other relevant metadata
  }

  return ret;
}

/******************************************************************************/

async function main() {
  await parse();
}

if (!module.parent) {
  main()
}

/******************************************************************************/

module.exports.parse = parse;

/******************************************************************************/

