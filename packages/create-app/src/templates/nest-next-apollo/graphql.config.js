module.exports = {
  schema: 'graphql/scheme.graphql',
  extensions: {
    codegen: {
      generates: {
        'graphql/client/index.ts': {
          documents: ['graphql/operations/**/*.graphql'],
          plugins: [
            { typescript: {} },
            { 'typescript-operations': {} },
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
