require('dotenv-expand').expand(require('dotenv').config());

const fs = require('fs');
const { generate } = require('@graphql-codegen/cli');

const { getIntrospectionQuery, printSchema, buildClientSchema } = require('graphql/index');

async function main(args) {
  const load = args.includes('--load');

  if (load) {
    const { data } = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getIntrospectionQuery(),
      }),
    }).then((response) => response.json());

    fs.writeFileSync('./graphql/schema.graphql', printSchema(buildClientSchema(data)), 'utf-8');
  }

  await generate(
    {
      schema: './graphql/schema.graphql',
      documents: [
        {
          './graphql/schema.graphql': {
            loader: './graphql.documents.js',
            pluginContext: {
              depthLimit: 3,
            },
          },
        },
      ],
      generates: {
        './graphql/client/index.ts': {
          documents: ['./graphql/operations/**/*.graphql'],
          plugins: [
            'typescript',
            'typescript-operations',
            {
              'typescript-react-apollo': {
                withHooks: true,
              },
            },
          ],
          config: {
            maybeValue: 'T | null',
            inputMaybeValue: 'T | null | undefined',
            scalars: {
              DateTime: 'string',
            },
          },
        },
      },
    },
    true
  );
}

main(process.argv.slice(2)).catch(console.error);

// module.exports = {
//   schema: './graphql/schema.graphql',
//   documents: [
//     {
//       './graphql/schema.graphql': {
//         loader: './graphql.documents.js',
//         pluginContext: {
//           depthLimit: 3,
//         },
//       },
//     },
//   ],
//   extensions: {
//     codegen: {
//       generates: {
//         './graphql/client/index.ts': {
//           documents: [
//             './graphql/operations/**/*.graphql',
//           ],
//           plugins: [
//             'typescript',
//             'typescript-operations',
//             {
//               'typescript-react-apollo': {
//                 withHooks: true,
//               },
//             },
//           ],
//           config: {
//             maybeValue: 'T | null',
//             inputMaybeValue: 'T | null | undefined',
//             scalars: {
//               DateTime: 'string',
//             },
//           },
//         },
//       },
//     },
//   },
// };
