module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
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
