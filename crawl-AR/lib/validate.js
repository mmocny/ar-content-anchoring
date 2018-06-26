/******************************************************************************/

/*
 * TODO: Call Parser, and set up events for everything
 * If there are any errors, then print the error
 */
async function validate(jsonld) {
}

/******************************************************************************/

async function main() {
  await validate({});
}

if (!module.parent) {
  main()
}

/******************************************************************************/

module.exports.validate = validate;

/******************************************************************************/

