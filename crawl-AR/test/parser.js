let assert = require("assert");
let parser = require('./../lib/parser');

describe("Parser", function() {
  it("Empty entry Returns empty index", async () => {
    let result = parser.parse([]);
    assert.deepEqual(await result, {
      byAddress: [],
       byGeolocation: []
       });
   });

  it("Single but empty entry returns empty index", async () => {
    let result = parser.parse([{
      }]);
    assert.deepEqual(await result, {
      byAddress: [],
       byGeolocation: []
       });
   });

  it("Single but empty entry returns empty index", async () => {
    let result = parser.parse([{
       uri: "",
       filename: "",
       attribs: "",
       jsonld: {
        context: "http://schema.org",
        "@type": "ARArtifact",
        nearby: {
         "@type": "GeoCoordinates",
         latitude: "10",
         longitude: "20",
        }
       }
      }]);
    assert.deepEqual(await result, {
      byAddress: [],
       byGeolocation: [{
        "elevation": undefined,
        "filename": "",
        "latitude": 10,
        "longitude": 20,
        "uri": "",
        "jsonld": {
          "context": "http://schema.org",
          "@type": "ARArtifact",
          "nearby": {
            "@type": "GeoCoordinates",
            "latitude": "10",
            "longitude": "20",
          }
        },
       }]
       });
   });
});
