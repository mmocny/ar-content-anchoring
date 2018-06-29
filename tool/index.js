#! /usr/bin/env node

/******************************************************************************/

global.__basedir = __dirname;

/******************************************************************************/

function help(argv) {
  console.log("Help yourself");
}

/******************************************************************************/

function unknown(argv) {
  console.log(`Valid commands:
    help
    sample
    extract
`);
}

/******************************************************************************/

async function main() {
  const parseArgs = require('minimist');
  const opts = {
    string: [], // argument names to always treat as strings
    boolean: [ "help" ], // argument names to always treat as booleans.  Double hyphen: --Arg means true
    alias: {
      "help": "-h",
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

  if (argv.h) {
    return help();
  }

  let command = argv._[0];
  switch (command) {
    case "extract":
      await require("./extract").extract(argv._.slice(1));
      break;

    case "help":
      help(argv);
      break;

    case "sample":
      await require('./sample').sample();
      break;

    default:
      unknown(argv);
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
