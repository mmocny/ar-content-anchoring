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

async function registerEvents() {
  $ = document.querySelector.bind(document);
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
