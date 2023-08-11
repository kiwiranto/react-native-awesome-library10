module.exports = {
  bracketSpacing: false,
  jsxBracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
  root: true,
  extends: [
    '@react-native-community/eslint-config',
    'eslint-config-prettier',
  ],
  rules: {
    'prettier/prettier': 0,
  }
};
