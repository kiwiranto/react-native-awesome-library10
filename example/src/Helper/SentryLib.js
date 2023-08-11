import Axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';

import { baseUrlLog, baseUrlLogApiKey } from '../Config/MainConfig';
import { store } from '../Config/Store';
import { getHeartBeat } from './Driver';

/**
 * this function is for capturing sentry with standard message
 * 
 * @author allandhino.pattras
 * @param {string} err 
 * @param {string} title 
 */
export const sentryCapture = (err, title = 'ERROR', overrideEmail = false, overrideMsisdn = false) => {
   setTimeout(async () => {
      let navigationName = 'none';
      let userEmail = false;
      let userMsisdn = false;

      try {
         const { navCleanName, memberData, modemData } = store.getState();
         const memberAttr = memberData?.data?.data?.attributes;
         navigationName = navCleanName;

         try {
            userEmail = memberAttr?.emailAccount ? memberAttr?.emailAccount
               : memberAttr?.facebookAccount ? memberAttr?.facebookAccount
                  : memberAttr?.googleAccount ? memberAttr?.googleAccount
                     : '';
         } catch (error) {
            console.log(error);
         }

         try {
            userMsisdn = modemData?.attributes?.msisdn;
         } catch (error) {
            console.log(error);
         }
      } catch (error) {
         console.log(error);
      }

      userEmail = overrideEmail ? overrideEmail : userEmail;
      userMsisdn = overrideMsisdn ? overrideMsisdn : userMsisdn;

      // postToLog(`${navigationName}][${resultSentryModemStatus.toString().replace(/,/g, ":")}] ${title} - ${err}`, title);

      postToLog(err, title, navigationName, userEmail, userMsisdn);

      // console.log("resultSentryModemStatus", resultSentryModemStatus);
      // Sentry.captureMessage(`[${navigationName}][${resultSentryModemStatus.toString().replace(/,/g, ":")}] ${title} - ${err}`)
   }, 200);
};

export const sentryInit = (metadata) => {
   try {
      Sentry.init({ release: `${metadata.appVersion}-codepush:${metadata.label}` });
   } catch (error) {
      console.warn('SentryLib@sentryInit', error);
   }
};

const postToLog = async (err, title, navigationName, userEmail, userMsisdn) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json',
            'Referrer': 'www1.myorbit.id',
            'x-api-key': baseUrlLogApiKey,
         }
      };

      /** start asynchronous call */
      const deviceDetailInfo = await Promise.all([
         DeviceInfo.getApiLevel(),
         DeviceInfo.getBatteryLevel(),
         DeviceInfo.getBrand(),
         DeviceInfo.getBuildNumber(),
         DeviceInfo.getCarrier(),
         DeviceInfo.getCodename(),
         DeviceInfo.getDeviceType(),
         DeviceInfo.getDeviceName(),
         DeviceInfo.getModel(),
         DeviceInfo.isAirplaneMode(),
         DeviceInfo.isEmulator(),
         DeviceInfo.getIpAddress(),
         DeviceInfo.getMacAddress(),
         sentryModemStatus()
      ])

      const body = {
         title: title,
         error: err,
         navigationName: navigationName,
         userEmail: userEmail,
         userMsisdn: userMsisdn,
         deviceStatus: `${deviceDetailInfo[13].toString().replace(/,/g, ':')}`,
         deviceInfo: {
            apiLevel: deviceDetailInfo[0],
            batteryLevel: deviceDetailInfo[1],
            brand: deviceDetailInfo[2],
            buildNumber: deviceDetailInfo[3],
            carrier: deviceDetailInfo[4],
            codeName: deviceDetailInfo[5],
            deviceType: deviceDetailInfo[6],
            deviceName: deviceDetailInfo[7],
            deviceModel: deviceDetailInfo[8],
            isAirplaneMode: deviceDetailInfo[9],
            isEmulator: deviceDetailInfo[10],
            ipAddress: deviceDetailInfo[11],
            deviceMacAddress: deviceDetailInfo[12]
         },
         createdDate: new Date()
      };

      const url = baseUrlLog;
      await Axios.post(url, JSON.stringify(body), config);
   } catch (error) {
      console.log('Sentrylib@postToLog', error.message);
      return false;
   }
};

/**
 * @returns {Array} [modemHaveInternet, modemIsConnected, modemLoggedinType, isInternetReachable, isWifiEnable]
 */
const sentryModemStatus = async () => {
   const { globalData } = store.getState();
   const { modemIP } = globalData;

   let modemHaveInternet = false;
   let modemIsConnected = false;
   let modemLoggedinType = false;
   let isInternetReachable = false;
   let isWifiEnable = false;

   try {
      const resultHeartBeat = await getHeartBeat(modemIP);

      if (resultHeartBeat) {
         modemLoggedinType = resultHeartBeat?.response?.userlevel[0] == '0' ? false : resultHeartBeat?.response?.userlevel[0];
         modemIsConnected = true;

         try {
            NetInfo.fetch().then((state) => {
               const connectionInternet = state.isInternetReachable;
               const typeWifi = state.type === 'wifi';
               const ssidOrbit = state?.details?.ssid?.toLowerCase();

               modemHaveInternet = connectionInternet && typeWifi && ssidOrbit?.includes('tselhome');
            });
         } catch (error) {
            console.log('modemHaveInternet', error);
         }
      }
   } catch (error) {
      console.log('resultHeartBeat', error);
   }

   try {
      const resultNetInfo = await NetInfo.fetch();
      isInternetReachable = resultNetInfo.isInternetReachable;
      isWifiEnable = resultNetInfo.isWifiEnabled;
   } catch (error) { }

   modemHaveInternet = modemHaveInternet ? 1 : 0;
   modemIsConnected = modemIsConnected ? 1 : 0;
   modemLoggedinType = modemLoggedinType ? 1 : 0;
   isInternetReachable = isInternetReachable ? 1 : 0;
   isWifiEnable = isWifiEnable ? 1 : 0;

   return [modemHaveInternet, modemIsConnected, modemLoggedinType, isInternetReachable, isWifiEnable];
};