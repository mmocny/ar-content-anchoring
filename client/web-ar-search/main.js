/******************************************************************************/

(function() {

anchorTracker = new indexer.AnchorTracker();
anchorTracker.start();

/******************************************************************************/

async function trackGeolocation(onLocationUpdate) {
  navigator.geolocation.getCurrentPosition(geolocationCallback, errorHandler);

  function geolocationCallback(location) {
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    onLocationUpdate(latitude, longitude);

  }

  /* Handles any errors from trying to get the user's current location */
  function errorHandler(error) {
    if (error.code == 1) {
      console.log("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      console.log("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      console.log("Error: TIMEOUT: Calculating the user's location too took long");
    } else {
      console.log("Unexpected error code")
    }
  };
}

/******************************************************************************/

async function registerEvents() {
  $ = document.querySelector.bind(document);

  anchorTracker.on('anchor_found', (jsonld) => {
    let p = $('#ARtifacts');
    let el = document.createElement('iframe');
    el.src = jsonld.asset.widget;
    if (p.firstChild) {
      p.insertBefore(el, p.firstChild);
    } else {
      p.appendChild(el);
    }
  });


  $('#addUri').addEventListener('click', async (event) => {
    let uri = $('#uri').value;
    sitemap.addToSitemap(uri);
    console.log('Added', uri, 'to sitemap');
    $('#uri').value = "";
  });

  $('#track').addEventListener('click', (event) => {
    trackGeolocation((latitude, longitude) => {
      $('#lat').value = latitude;
      $('#lon').value = longitude;
    });
  });

  $('#search').addEventListener('click', async (event) => {
    let latitude = parseFloat($('#lat').value);
    let longitude = parseFloat($('#lon').value);
    let radius = parseFloat($('#radius').value);

    anchorTracker.update({ latitude, longitude, radius: 5000 });

    //let results = await indexer.lookupByGeolocation({ latitude, longitude, radius });
  });

  $('#add').addEventListener('click', async (event) => {
    let latitude = parseFloat($('#lat').value);
    let longitude = parseFloat($('#lon').value);
    let content = $('#content').value;

    let jsonld = {
      "@context": "http://schema.org",
      "@type": "ARArtifact",
      "nearby": {
        "@type": "GeoCoordinates",
        latitude,
        longitude,
        "elevation": "0"
      },
      "asset": {
        "widget": content
      }
    };

    console.log("adding:", { latitude, longitude, uri: content, jsonld });
    indexer.addByGeolocation({ latitude, longitude, uri: content, jsonld });
  });
}

/******************************************************************************/

async function main() {
  await registerEvents();
}

/******************************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  main().catch((ex) => {
    console.error(ex.stack || ex);
  });
});

/******************************************************************************/

})();

/******************************************************************************/
