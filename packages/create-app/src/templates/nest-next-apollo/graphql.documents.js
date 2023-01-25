const { buildOperationNodeForField } = require('@graphql-tools/utils');
const { buildSchema, print, parse } = require('graphql');
const fs = require('fs');

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

async function main(schemaFile, { pluginContext }) {
  const schema = buildSchema(fs.readFileSync(schemaFile, 'utf-8'));

  const operationsDictionary = {
    query: { ...(schema.getQueryType()?.getFields() ?? {}) },
    mutation: { ...(schema.getMutationType()?.getFields() ?? {}) },
    subscription: { ...(schema.getSubscriptionType()?.getFields() ?? {}) },
  };

  let documentString = ``;

  for (const [operationKind, operationValue] of Object.entries(operationsDictionary)) {
    for (const operationName of Object.keys(operationValue)) {
      const operationAST = buildOperationNodeForField({
        schema,
        kind: operationKind,
        field: operationName,
        depthLimit: pluginContext.depthLimit || 1,
      });

      documentString += print(operationAST);
    }
  }

  return parse(documentString.replace(/(query|mutation|subscription) (.+?) {/gm, (str, kind, value) => {
    return `${kind} ${capitalizeFirstLetter(value.replace(`_${kind}`, ''))} {`;
  }));
}

module.exports = main;
