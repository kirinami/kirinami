import { builtinModules } from 'node:module';
import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import typescriptEslint from 'typescript-eslint';

const javascriptExtensions = ['js', 'jsx', 'mjs', 'cjs'];
const typescriptExtensions = ['ts', 'tsx', 'mts', 'cts'];

export default typescriptEslint.config(
  includeIgnoreFile(path.resolve('.gitignore')),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  eslint.configs.recommended,

  ...typescriptEslint.configs.recommendedTypeChecked,
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,

  {
    files: [`**/*.{${typescriptExtensions}}`],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
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
        },
      ],
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
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
    files: [`**/*.{${javascriptExtensions},${typescriptExtensions}}`],
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      'no-empty-pattern': 'warn',
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true,
          allowUnboundThis: true,
        },
      ],

      'import/no-unresolved': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-duplicates': 'error',
      'import/no-deprecated': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/__tests__/**',
            '**/__mocks__/**',
            '**/*.?(*-){test,spec}.*',
            '*.{config,setup}?(.*).{js,mjs,cjs}',
          ],
          peerDependencies: false,
          bundledDependencies: false,
          optionalDependencies: false,
        },
      ],
      'import/named': 'off',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',

      'unused-imports/no-unused-imports': 'error',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            [`^(${builtinModules.join('|')})(/|$)`, '^node:'],
            ['^react', '^@?\\w', '^'],
            ['^@prisma/\\w'],
            ['^@/\\w'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.styles$'],
            ['^.+\\.module\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  {
    files: [`**/*.{${javascriptExtensions}}`],
    ...typescriptEslint.configs.disableTypeChecked,
  },

  prettierConfig,
);
