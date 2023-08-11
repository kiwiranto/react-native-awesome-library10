import { Platform } from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore, createTransform } from 'redux-persist';

import { reactAppReducerKey1, reactAppReducerKey2, softwareStage } from './MainConfig';
import { defaultState, rootReducer } from './Reducer';

var CryptoJS = require('crypto-js');
var a = ['\x62\x57\x46\x74\x59\x58\x51\x3d']; (function (b, e) { var f = function (g) { while (--g) { b['push'](b['shift']()); } }; f(++e); }(a, 0x1a4)); var b = function (c, d) { c = c - 0x0; var e = a[c]; return e; }; function obs() { return b('\x30\x78\x30'); }

let reducer = false;
const tranformData = createTransform(
   state => {
      let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(state), obs()).toString();
      state = ciphertext;
      return state;
   },
   (state) => {
      const bytes = CryptoJS.AES.decrypt(state, obs());
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      let newState;
      if (typeof originalText === 'object') {
         newState = JSON.stringify(originalText);
      } else {
         newState = JSON.parse(originalText);
      }
      return newState;
   },
   {
      blacklist: []
   }
);

if (Platform.OS == "android" || Platform.OS == "ios") {
   const createSensitiveStorage = require("redux-persist-sensitive-storage");
   const storageApp = createSensitiveStorage.default({
      keychainService: "4103281cb80f2e98b685339bc934994c0784af6259eb6494f8805a07d193766d",
      sharedPreferencesName: "1215016618d9a0684c9475fd1985b4303c3877640f8220dcc734c0e1085a7835"
   });

   reducer = persistReducer(
      {
         key: Platform.OS == "ios" ? reactAppReducerKey2 : reactAppReducerKey1,
         transforms: [
            tranformData
         ],
         timeout: 30000,
         storage: storageApp,
      },
      rootReducer
   )
} else {
   const storageWeb = require("redux-persist/lib/storage");

   reducer = persistReducer(
      {
         key: reactAppReducerKey1,
         transforms: [
            tranformData
         ],
         timeout: 60000,
         storage: storageWeb.default,
      },
      rootReducer
   )
}

let composeEnhancers = false;

if (softwareStage === 'dev') {
   composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
      require('remote-redux-devtools').composeWithDevTools)({
         name: Platform.OS,
      });
}

const composeStore = composeEnhancers ? composeEnhancers(applyMiddleware()) : undefined;
const store = createStore(
   reducer,
   defaultState,
   softwareStage === 'dev' ? composeStore : undefined,
);

const persistor = persistStore(store);

export { persistor, store };