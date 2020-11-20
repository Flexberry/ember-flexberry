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
    'qunit'
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
    'ember/no-get': 'off',
    'ember/use-ember-get-and-set': 'error',
    'ember/no-jquery': 'warn',
    'ember/no-observers': 'warn',
    'ember/no-mixins': 'warn',
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
