/**
 * @format
 */
import { AppRegistry } from 'react-native';
// import { decode, encode } from 'base-64';
// import { startNetworkLogging } from 'react-native-network-logger';
import * as Sentry from '@sentry/react-native';

import App from './src/App';

// startNetworkLogging();
Sentry.init({
  dsn: 'https://d19b35d3003c490580e5f73dd1ac775c@o404384.ingest.sentry.io/5268036'
});

// if (!global.btoa) {
//    global.btoa = encode;
// }

// if (!global.atob) {
//    global.atob = decode;
// }

AppRegistry.registerComponent('main', () => App);
