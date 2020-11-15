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
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
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
    'ember/no-mixins': 'warn'
  }
};
