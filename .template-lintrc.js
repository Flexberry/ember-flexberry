'use strict';

module.exports = {
  extends: ['recommended', 'stylistic'],
  rules: {
    'no-bare-strings': true
  },
  ignore: [
    'blueprints/flexberry-edit-form/snippets/**',
    'blueprints/**/files/**/templates/__name__'
  ]
};
