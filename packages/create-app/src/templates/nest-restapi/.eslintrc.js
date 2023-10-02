const { builtinModules } = require('node:module');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['.husky', '.yarn', 'node_modules'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/*.js'],
      extends: ['eslint:recommended'],
    },
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      extends: ['airbnb/base', 'airbnb-typescript/base', 'plugin:@typescript-eslint/recommended'],
      rules: {
        'no-empty-pattern': 'off',
        'no-param-reassign': 'off',
        'sort-imports': 'off',
        'consistent-return': 'off',
        'prefer-destructuring': 'off',
        'class-methods-use-this': 'off',

        'import/no-unresolved': 'off',
        'import/order': 'off',
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',

        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: true,
            types: {
              '{}': false,
            },
          },
        ],
      },
    },
    {
      files: ['**/*.{js,ts}'],
      extends: ['prettier'],
      plugins: ['unused-imports', 'simple-import-sort', 'prettier'],
      rules: {
        'no-unused-vars': 'off',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',

        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],

        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^\\u0000'],
              [`^(${builtinModules.join('|')})(/|$)`, '^node:'],
              ['^@?\\w', '^'],
              ['^@prisma/\\w'],
              ['^@/\\w'],
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              ['^.+\\.module\\..+$'],
            ],
          },
        ],
        'simple-import-sort/exports': 'error',

        'prettier/prettier': 'error',
      },
    },
    {
      files: ['**/*.{spec,test}.{js,ts}'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
