/******************************************************************************/

// Helper function to convert an eventemitter event into a Promise
// Will wait for some event to fire, then resolve promise.
//
// e.g. Turn this:
//    foo.on('bar', () => { ... })
//
// Into this:
//    promisifyEmitter(foo, 'bar').then(() => { ... })
//
// This is really only useful when using in combination with async-await and
// one-time events, e.g.:
//
//    let result = await promisifyEmitter(foo, 'bar');
//
// ...which is much harder to do with callback style.
function promisifyEmitter (emitter, eventname, error = "error") {
  return new Promise((resolve, reject) => {
    emitter.on(eventname, resolve)
      .on(error, reject);
  });
}

/******************************************************************************/

async function main() {
}

if (!module.parent) {
  main()
}

/******************************************************************************/

module.exports = promisifyEmitter;

/******************************************************************************/
