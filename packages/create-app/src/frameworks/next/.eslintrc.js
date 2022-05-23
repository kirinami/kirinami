module.exports = {
  extends: [
    'next/core-web-vitals',

    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',

    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-console': 'warn',
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

    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      aspects: ['invalidHref', 'preferButton'],
    }],
    'jsx-a11y/label-has-associated-control': ['error', {
      assert: 'nesting',
    }],

    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/destructuring-assignment': 'off',

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
  ignorePatterns: ['.nest', 'node_modules', '**/*.js', '**/*.jsx'],
};
