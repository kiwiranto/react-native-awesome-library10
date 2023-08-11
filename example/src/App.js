/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
// import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { LogBox, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import './i18n.mobile';

import MobileNavigator from './Navigator/MobileNavigator';
import { getRandomIdentifier } from './Helper/Function';
// import { fetchConfig } from './Helper/FirebaseIntegrationLibrary';
// import { insiderCallBack } from './Helper/InsiderCallback';
// import { adjustInit } from './Helper/Adjust';

// import CAnimationWrapper from './Components/CAnimationWrapper';
// import CModemDisconnect from './Components/CModemDisconnect';

import { persistor, store } from './Config/Store';
import { growthbookBaseUrl, growthbookKey } from './Config/MainConfig';
import { DefaultFeatures } from './Config/Growthbook';

if (__DEV__) {
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications
}

const App = () => {
  const [features, setFeatures] = useState({
    login: {
      defaultValue: true
    }
  });

  const growthbook = new GrowthBook({
    features: DefaultFeatures
  });

  async function growthbookInitial() {
    fetch(growthbookBaseUrl + growthbookKey)
      .then((res) => res.json())
      .then((parsed) => {
        if (parsed?.features) {
          growthbook.setFeatures(parsed?.features);
        }
        setFeatures(features);
      })
      .catch((error) => {
        // console.log('error', error);
        growthbook.setFeatures(DefaultFeatures);
      });

    let id = null;
    try {
      id = await AsyncStorage.getItem('targeting-id-growthbook');
    } catch (err) {
      console.log('GET GROWTHBOOK ID ERROR:', err);
    }

    if (!id) {
      id = getRandomIdentifier();
      try {
        await AsyncStorage.setItem('targeting-id-growthbook', id);
      } catch (e) {
        console.log('STORE GROWTHBOOK ID ERROR:', e);
      }
    }

    growthbook.setAttributes({ id });
  }

  useEffect(() => {
    // if (Platform.OS == 'ios') {
    //   insiderCallBack();
    // }
    // adjustInit();
    growthbookInitial();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GrowthBookProvider growthbook={growthbook}>
          <MobileNavigator />
        </GrowthBookProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
