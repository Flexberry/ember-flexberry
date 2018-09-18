module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
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
  },
  overrides: [
    // node files
    {
      files: [
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    },
    {
      files: [
        'app/mixins/regenerated/models/**/*.js',
        'addon/mixins/regenerated/models/**/*.js',
        'addon/addon/mixins/regenerated/models/**/*.js',
        'tests/dummy/app/mixins/regenerated/models/**/*.js',
      ],
      rules: {
        'no-unused-vars': 'off'
      }
    },
    {
      files: [
        'app/locales/**/*.js',
        'addon/locales/**/*.js',
        'addon/addon/locales/**/*.js',
        'tests/dummy/app/locales/**/*.js'
      ],
      rules: {
        'ember/avoid-leaking-state-in-ember-objects': 'off'
      }
    }
  ]
};
