const path = require('path');

module.exports = {
  dependencies: {
    'react-native-awesome-library10': {
      root: path.join(__dirname, '..'),
    },
  },
  project: {
    ios: {},
    android: {} // grouped into "project"
  },
  assets: ['./src/Assets/app'] // stays the same
};
