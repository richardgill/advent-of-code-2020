module.exports = {
  env: {
    browser: false,
    es2020: true,
  },
  plugins: ['prettier'],
  extends: ['airbnb-base', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: { 'prettier/prettier': 'error', 'no-console': 'off', 'import/prefer-default-export': 'off' },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
}
