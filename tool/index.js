/* Hello! */

/******************************************************************************/

global.__basedir = __dirname;

/******************************************************************************/

async function main() {
  const parseArgs = require('minimist');
  const opts = {
    string: [], // argument names to always treat as strings
    boolean: [], // argument names to always treat as booleans.  Double hyphen: --Arg means true
    alias: {
    }, // maps argument to list of aliases
    default: {
    }, // maps argument names to default values

    stopEarly: false, // when true, populate everything after first non-arg as `_` values
    '--': true, // when true, `_` includes only up to `--` and `--` includes the rest
    /* // Unknown seems to be called for all options..
    unknown: (arg) => {
      console.warn("Unexpected argument:", arg);
    },
    */
  };

  let argv = parseArgs(process.argv.slice(2), opts);

  let command = (argv._ || ["sample"]) [0]
  switch (command) {
    case "sample":
      await require('./sample').sample();
      break;

    default:
      console.warn("Unknown command:", command);
      break;
  }
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
