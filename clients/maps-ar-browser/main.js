/******************************************************************************/

(function() {

/******************************************************************************/

async function trackGeolocation(onLocationUpdate) {
  /*
  let geoQuery = geoIndex.query({
    center: [0, 0],
    radius: 0
  });

  geoQuery.on("key_entered", function(key, location) {
    console.log(key + " entered the query. Hi " + key + "!");
  });

  geoQuery.on("key_exited", function(key, location) {
    console.log(key + " migrated out of the query. Bye bye :(");
  });

  geoQuery.on("key_moved", function(key, location) {
    console.log(key + " moved to somewere else within the query.");
  });

  // Update query
  geoQuery.updateCriteria({
    center: [30.9022, -166.6680], // lat, lon
    radius: 3000
  });
  */

  navigator.geolocation.getCurrentPosition(geolocationCallback, errorHandler);

  function geolocationCallback(location) {
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    //console.log("Retrieved user's location: [" + latitude + ", " + longitude + "]");

    onLocationUpdate(latitude, longitude);

    /*
    geoQuery.updateCriteria({
      center: [lat, lon], // lat, lon
      radius: radius
    });
    */
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

async function appendAllNearbyMarkers(latitude, longitude, radius) {
  let map = $('google-map');
  let results = await indexer.lookupByGeolocation({ latitude, longitude, radius });

  for (let result of results) {
    let marker = document.createElement('google-map-marker');

    marker.map = map;
    marker.clickEvents = true;

    // TODO: this parsing presumes structure of the ARtifact json-ld.  Would be better in indexer API has semantic descriptor for these values attached alongside raw json-ld
    marker.latitude = result.nearby.latitude;
    marker.longitude = result.nearby.longitude;
    // TODO: We have no metadata for the widget yet.
    marker.title = result.asset.widget;

    marker.addEventListener('google-map-marker-click', (e) => {
      console.log(marker.title);
      window.location.href = "webar://" + result.asset.widget;
    });

    map.appendChild(marker);
  }
}

async function registerEvents() {
  $ = document.querySelector.bind(document);
  /*
  $('#addUri').addEventListener('click', async function(event) {
    let uri = $('#uri').value;
    sitemap.addToSitemap(uri);
    console.log('Added', uri, 'to sitemap');
    $('#uri').value = "";
  });

  $('#track').addEventListener('click', (event) => {
    trackGeolocation((lat, lon) => {
      $('#lat').value = lat;
      $('#lon').value = lon;
    });
  });

  $('#search').addEventListener('click', async function(event) {
    let latitude = parseFloat($('#lat').value);
    let longitude = parseFloat($('#lon').value);
    let radius = parseFloat($('#radius').value);

    let results = await indexer.lookupByGeolocation({ latitude, longitude, radius });

    let p = $('#ARtifacts');

    for (let result of results) {
      let el = document.createElement('iframe');
      el.src = result.asset.widget;
      if (p.firstChild) {
        p.insertBefore(el, p.firstChild);
      } else {
        p.appendChild(el);
      }
    }
  });
  */

  let map = $('google-map');
  map.addEventListener('google-map-ready', (e) => {
    trackGeolocation((lat, long) => {
      map.latitude = lat;
      map.longitude = long;
      let radius = 5000; // TODO: use map.zoom?

      appendAllNearbyMarkers(lat, long, radius);
    });
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
