'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember',
    'hbs',
    'jsdoc',
    'qunit',
    'todo-errors'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:jsdoc/recommended',
    'plugin:qunit/two'
  ],
  env: {
    browser: true
  },
  rules: {
    'ember/new-module-imports': 'off',
    'ember/use-ember-data-rfc-395-imports': 'off',
    'ember/no-get': 'off',
    'ember/use-ember-get-and-set': ['error', { ignoreThisExpressions: true, }],
    'ember/no-jquery': 'warn',
    'ember/no-observers': 'warn',
    'ember/no-mixins': 'warn',
    'ember/require-computed-property-dependencies': 'warn',
    'hbs/check-hbs-template-literals': 'error'
  },
  reportUnusedDisableDirectives: true,
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/**/*.js',
        'blueprints/**/*.ts',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended']
    }
  ]
};
