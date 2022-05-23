module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',

    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-console': 'off',
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
    'prefer-arrow-callback': ['error', {
      'allowNamedFunctions': true,
      'allowUnboundThis': true,
    }],
    'object-curly-newline': ['error', {
      consistent: true,
      multiline: true,
    }],
    'class-methods-use-this': 'off',
    'max-len': ['error', 128, 2, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],

    'import/no-named-as-default': 'off',
    'import/no-cycle': 'off',
    'import/order': ['error', {
      groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
      pathGroups: [
        {
          'pattern': '@/**',
          'group': 'internal',
        },
      ],
      'newlines-between': 'always',
    }],
    'import/prefer-default-export': 'off',

    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/indent': ['error', 2, {
      SwitchCase: 1,
      ignoreComments: true,
      ignoredNodes: [
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
        'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
      ],
    }],
    '@typescript-eslint/member-delimiter-style': ['error', {
      overrides: {
        typeLiteral: {
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
        },
        interface: {
          singleline: {
            delimiter: 'semi',
            requireLast: true,
          },
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
        },
      },
    }],
    '@typescript-eslint/lines-between-class-members': ['error', 'always', {
      exceptAfterSingleLine: true,
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  ignorePatterns: ['.nest', 'node_modules', '**/*.js'],
};
