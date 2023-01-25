const { getIntrospectionQuery, buildClientSchema, printSchema } = require('graphql');
const fs = require('fs');

async function main(schemaFile) {
  const response = await fetch('http://127.0.0.1:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getIntrospectionQuery(),
    }),
  });

  const data = await response.json();

  const schema = buildClientSchema(data.data);

  fs.writeFileSync(schemaFile, printSchema(schema), 'utf-8');

  return schema;
}

module.exports = main;
