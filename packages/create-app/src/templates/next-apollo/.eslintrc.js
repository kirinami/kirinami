module.exports = {
  extends: [
    'next/core-web-vitals',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-console': 'warn',
    'no-param-reassign': 'off',
    'no-restricted-exports': 'off',
    'no-empty-pattern': 'off',
    'max-len': ['error', 128, 2, {
      ignoreUrls: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'consistent-return': 'off',
    'prefer-destructuring': 'off',
    'class-methods-use-this': 'off',
    'object-curly-newline': ['error', {
      consistent: true,
      multiline: true,
    }],
    'implicit-arrow-linebreak': 'off',

    'import/no-cycle': 'off',
    'import/no-named-as-default': 'off',
    'import/prefer-default-export': 'off',
    'import/order': ['error', {
      groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
      pathGroups: [
        {
          pattern: '@/**',
          group: 'internal',
        },
      ],
      'newlines-between': 'always',
    }],

    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/destructuring-assignment': 'off',
    'react/require-default-props': 'off',

    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['a'],
      aspects: ['invalidHref', 'preferButton'],
    }],
    'jsx-a11y/label-has-associated-control': ['error', {
      assert: 'nesting',
    }],

    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-inferrable-types': 'warn',
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
      },
    }],
    '@typescript-eslint/lines-between-class-members': ['error', 'always', {
      exceptAfterSingleLine: true,
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent': ['error', 2, {
      SwitchCase: 1,
      ignoredNodes: [
        'TSTypeParameterInstantiation',
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
        'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
      ],
    }],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
