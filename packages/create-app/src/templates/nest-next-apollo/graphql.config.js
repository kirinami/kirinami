module.exports = {
  overwrite: true,
  schema: {
    './graphql/scheme.graphql': {
      loader: './graphql.schema.js',
    },
  },
  documents: [
    {
      './graphql/scheme.graphql': {
        loader: './graphql.documents.js',
        pluginContext: {
          depthLimit: 3,
        },
      },
    },
  ],
  extensions: {
    codegen: {
      generates: {
        './graphql/client/index.ts': {
          documents: [
            './graphql/operations/**/*.graphql',
          ],
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
  },
};
