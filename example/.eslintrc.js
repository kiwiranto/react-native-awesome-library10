module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@babel/eslint-parser',
  extends: [
    '@react-native-community/eslint-config',
    'eslint-config-prettier'
  ],
  rules: {
    'prettier/prettier': 0,
    'react/jsx-fragments': 1,
    'react-hooks/exhaustive-deps': 0,
    'react-native/no-inline-styles': 0,
    'comma-dangle': [1, 'never'],
    'eol-last': 1,
    eqeqeq: 0,
    'no-bitwise': 0,
    'no-eval': 0,
    'no-unreachable': 1,
    'no-unused-vars': 1,
    semi: 1,
    quotes: [1, 'single'],
  },
  globals: {
    btoa: true,
  },
};
