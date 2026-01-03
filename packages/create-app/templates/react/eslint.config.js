import { builtinModules } from 'node:module';
import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import cssModulesPlugin from 'eslint-plugin-css-modules';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  includeIgnoreFile(path.resolve('.gitignore')),

  eslint.configs.recommended,

  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,

  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],

  reactHooksPlugin.configs.flat['recommended-latest'],

  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  importPlugin.flatConfigs.react,

  {
    files: [`**/*.{js,jsx,mjs,cjs,ts,tsx}`],
    rules: {
      'no-empty-pattern': 'warn',
      'no-useless-return': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['default'],
              message: 'Please use named imports instead.',
            },
          ],
        },
      ],
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true,
          allowUnboundThis: true,
        },
      ],
    },
  },

  {
    files: [`**/*.{ts,tsx}`],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-spread': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-extraneous-class': [
        'error',
        {
          allowConstructorOnly: true,
          allowEmpty: true,
          allowStaticOnly: false,
          allowWithDecorator: true,
        },
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: true,
          ignoreVoidOperator: false,
          ignoreVoidReturningFunctions: false,
        },
      ],
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          ignoreRestArgs: true,
        },
      ],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        {
          ignoreBooleanCoercion: true,
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
          ignorePrimitives: {
            bigint: false,
            number: false,
            boolean: false,
            string: false,
          },
          ignoreTernaryTests: false,
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowArray: false,
          allowBoolean: false,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
    },
  },

  {
    files: [`**/*.{js,jsx,mjs,cjs,ts,tsx}`],
    plugins: {
      'unused-imports': unusedImportsPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      'import/no-duplicates': 'error',
      'import/no-deprecated': 'warn',
      'import/no-mutable-exports': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/__tests__/**',
            '**/__mocks__/**',
            '**/*.?(*-){test,spec}.*',
            '*.{config,setup}?(.*).{js,jsx,mjs,cjs,ts,tsx}',
          ],
          peerDependencies: false,
          bundledDependencies: false,
          optionalDependencies: false,
        },
      ],
      'import/first': 'error',
      'import/newline-after-import': 'error',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'warn',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^\\u0000@/\\w'],
            [`^(${builtinModules.join('|')})(/|$)`, '^node:'],
            ['^react', '^next', '^@?\\w', '^'],
            ['^@/\\w'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.module\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },

  {
    files: [`**/*.{js,jsx,mjs,cjs,ts,tsx}`],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/no-array-index-key': 'warn',
      'react/prop-types': 'off',

      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },

  {
    files: [`**/*.{js,jsx,mjs,cjs,ts,tsx}`],
    plugins: {
      'css-modules': cssModulesPlugin,
    },
    rules: {
      'css-modules/no-unused-class': ['error', { camelCase: 'only' }],
      'css-modules/no-undef-class': ['error', { camelCase: 'only' }],
    },
  },

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: [`**/*.{js,jsx,mjs,cjs}`],
    ...typescriptEslint.configs.disableTypeChecked,
  },

  prettierPlugin,
);

