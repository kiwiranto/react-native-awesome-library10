import messaging from '@react-native-firebase/messaging';
import remoteConfig from '@react-native-firebase/remote-config';

import { AxiosAdapter } from '../Config/AxiosAdapter';
import { baseUrlMember, baseUrlMemberApiKey } from '../Config/MainConfig';
import { store } from '../Config/Store';

export const setMemberFcmToken = async (accessToken = false) => {
   try {
      const fcmToken = await messaging().getToken();

      if (!accessToken) {
         accessToken = store.getState()?.accessTokenData?.accessToken;
      }

      const config = {
         headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'x-api-key': baseUrlMemberApiKey,
            'x-localization': 'id'
         }
      };

      const body = {
         deviceId: fcmToken
      };

      const url = `${baseUrlMember}v1/members/token-device`;

      return await AxiosAdapter.put(url, body, config);
   } catch (error) {
      console.log('Helper.FirebaseIntegrationLibrary@setMemberFcmToken: ', error.response);
      return false;
   }
};

export const fetchConfig = async () => {
   await remoteConfig().setConfigSettings({
      isDeveloperModeEnabled: __DEV__,
      minimumFetchInterval: 0
   });
   await remoteConfig().fetchAndActivate()
      .then(activated => {
         if (!activated) console.log('Remote Config not activated');
         return remoteConfig().fetch();
      });
};

export const refreshConfig = async () => await remoteConfig().fetchAndActivate();

export const getRemoteValue = key => remoteConfig().getValue(key);