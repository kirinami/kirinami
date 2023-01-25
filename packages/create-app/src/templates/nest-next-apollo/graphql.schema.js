const { buildSchema } = require('graphql/utilities');
const fs = require('fs');

async function main(schemaFile) {
  return buildSchema(fs.readFileSync(schemaFile, 'utf-8'));
}

module.exports = main;
