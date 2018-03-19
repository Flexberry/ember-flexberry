module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
    'no-case-declarations': 'warn',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
  }
};
