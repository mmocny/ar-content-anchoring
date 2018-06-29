/* Hello! */

/******************************************************************************/

global.__basedir = __dirname;

/******************************************************************************/

async function main() {
  await require('./sample').sample()
}

/******************************************************************************/

if (!module.parent) {
  main().catch((ex) => {
    console.error(ex.stack || ex);
  }).then(() => {
    try {
      const Firebase = require('firebase');
      Firebase.database().goOffline();
    } catch (ex) { } // We may not have actually started FireBase, catching the error
  });
}

/******************************************************************************/
