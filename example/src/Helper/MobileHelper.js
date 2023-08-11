import {
   Dimensions,
   Linking,
   PermissionsAndroid,
   PixelRatio,
   Platform,
   StatusBar,
   ToastAndroid
} from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import analytics from '@react-native-firebase/analytics';
import CookieManager from '@react-native-cookies/cookies';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-tiny-toast';
import moment from 'moment';

import { LOGOUT, SET_APP_UPDATE_STATUS } from '../Config/Reducer';
import { store } from '../Config/Store';
import { logout } from './ActionGlobal';
import { getDurationSecond, getTime } from './Function';
import { Fonts } from '../Components/app/CThemes';


export const ToastHandler = (msg) => {
   if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.LONG);
   } else {
      Toast.show(msg, {
         position: Toast.position.BOTTOM,
         duration: Toast.duration.SHORT,
         containerStyle: {
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingVertical: 8,
            paddingHorizontal: 12,
            shadowOffset: {
               width: 6,
               height: 4
            },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
            shadowColor: '#202023'
         },
         textStyle: {
            color: '#000',
            fontFamily: Fonts.poppins,
            fontSize: 14
         }
      });
   }
};

export const getStatusBarHeight = () => {
   if (Platform.OS === 'ios') {
      return 25;
   }
   return StatusBar.currentHeight;
};

export const supportedFullScreen = () => {
   return ['Dashboard', 'CoachMark', 'KaleidoscopeScreen', 'OnboardingScreen'];
};

export const heightPercentageToDP = heightPercent => {
   let screenHeight = Dimensions.get('window').height;
   // Parse string percentage input and convert it to number.
   const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);

   // Use PixelRatio.roundToNearestPixel method in order to round the layout
   // size (dp) to the nearest one that correspons to an integer number of pixels.
   return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

export const widthPercentageToDP = widthPercent => {
   let screenWidth = Dimensions.get('window').width;
   // Parse string percentage input and convert it to number.
   const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);

   // Use PixelRatio.roundToNearestPixel method in order to round the layout
   // size (dp) to the nearest one that correspons to an integer number of pixels.
   return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

/** timeout function when download update */
var timeoutUpdateDownload = false;

export const hideUpdateDownload = (timeout) => {
   clearTimeout(timeoutUpdateDownload);

   timeoutUpdateDownload = false;
   timeoutUpdateDownload = setTimeout(() => {
      store.dispatch({
         type: SET_APP_UPDATE_STATUS,
         data: {
            isUpdate: false
         }
      });
   }, timeout);
};

export const checkConnectedToInternet = async () => {
   const resultNetInfo = await NetInfo.fetch();

   if (resultNetInfo.isInternetReachable) {
      return true;
   } else {
      return false;
   }
};

/**
 * 
 * @param {array} arrDevice list of device on api memberData (/members) or infoModem (/members/device-router)
 * @returns {array} return data that deviceType is not INDIBOX
 */
export const filterDataModem = (arrDevice) => {
   try {
      const dataModem = arrDevice.filter((data) => {
         return data.attributes.deviceType != 'INDIBOX';
      });

      return dataModem;
   } catch (error) {
      return [];
   }
};

/**
 * 
 * @param {string} eventName || event name for submit log event
 * @param {string} deviceID || if not login deviceID use unique ID from DeviceInfo, if login using memberId
 * @param {object} eventParams || value will be submit with logEvent
 */
export const firebaseTracker = async (eventName, eventParams, screenName = '') => {
   const deviceID = await DeviceInfo.getUniqueId();

   analytics().setUserProperty('deviceID', JSON.stringify(deviceID));
   analytics().setUserId(deviceID);
   if (!eventParams) {
      analytics().logEvent(eventName);
   } else {
      analytics().logEvent(eventName, eventParams);
   }

   if (screenName) {
      analytics().logScreenView({
         screen_name: '',
         screen_class: ''
      });
      analytics().logScreenView({
         screen_name: screenName,
         screen_class: screenName
      });
   }

   // console.log(eventName, deviceID, eventParams, screenName);
};

export const firebaseTrackerScreenName = async (screenName, screenClass) => {
   const deviceID = await DeviceInfo.getUniqueId();

   analytics().setUserProperty('deviceID', JSON.stringify(deviceID));
   analytics().setUserId(deviceID);
   analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass
   });
};

export const firebaseTrackerEngagement = async  (eventParams) => {
   const deviceID = await DeviceInfo.getUniqueId();

   analytics().setUserProperty('deviceID', JSON.stringify(deviceID));
   analytics().setUserId(deviceID);
   analytics().logEvent('engagement', eventParams);
};

export const firebaseTrackerSessionDuration = (eventName, timeStart, deviceID) => {
   const timeEnd = getTime();
   let duration = false;

   if (timeStart) {
      duration = getDurationSecond(timeStart, timeEnd);
   }

   const eventParams = {
      sessionDuration: duration
   };

   firebaseTracker(eventName, eventParams, deviceID);
};


export const storageAskForUserPermissions = () => {
   return new Promise(async (resolve, reject) => {
      try {

         if (Platform.OS == 'android') {
            const granted = await PermissionsAndroid.request(
               PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
               {
                  'title': 'Storage',
                  'message': 'We need your permission in order to share image'
               }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
               console.log('Thank you for your permission');
               resolve(true);
            } else {
               console.log('You will not able to share image');
               resolve(false);
            }
         } else {
            const permissionRequestIos = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

            if (permissionRequestIos === RESULTS.GRANTED) {
               console.log('Thank you for your permission');
               resolve(true);
            } else {
               console.log('You will not able to share image');
               resolve(false);
            }
         }
      } catch (err) {
         console.warn('ModemLibrary@storageAskForUserPermissions', JSON.stringify(err));
         resolve(false);
      }
   });
};

export const handlerLogout = async () => {
   return new Promise(async (resolve, reject) => {
      try {
         const { accessTokenData, loginTokenIdData } = store.getState();

         const result = await logout(accessTokenData.accessToken, loginTokenIdData);
         if (result) {
            setTimeout(() => {
               CookieManager.clearAll();

               store.dispatch({
                  type: LOGOUT
               });

               resolve(true);
            }, 500);
         } else {
            resolve(false);
         }
      } catch (error) {
         console.log(error);
         resolve(false);
      }
   });
};

export const handlerLogoutRedux = () => {
   store.dispatch({
      type: LOGOUT
   });
};

export const openUrlMobile = async (url) => {
   console.log(url);
   Linking.canOpenURL(url).then(supported => {
      if (supported) {
         return Linking.openURL(url);
      } else {
         console.log('Don\'t know how to open URI: ' + url);
      }
   }).catch(err => console.error('An error occurred', err));
};

export const getIsModemAndroidOnly = (packageType) => {
   const { modemAndroidOnly } = store.getState();
   let isModemAndroidOnly = false;

   modemAndroidOnly.forEach(data => {
      if (data.includes(packageType)) {
         isModemAndroidOnly = true;
      }
   });

   return isModemAndroidOnly;
};

export const getIsModemAndroidOnlyFullfeature = (packageType) => {
   const { modemAndroidOnlyFullfeature } = store.getState();
   let isModemAndroidOnlyFullfeature = false;

   modemAndroidOnlyFullfeature.forEach(data => {
      if (data.includes(packageType)) {
         isModemAndroidOnlyFullfeature = true;
      }
   });

   return isModemAndroidOnlyFullfeature;
};

export const calculateQuotaValue = (value) => {
   try {
      if (!value) {
         return '0GB';
      }

      let isMB = (value < 1048576 ? true : false);
      let newValue = isMB ? value / 1024 : value / 1048576;
      let isFixed = newValue % 1;

      if (isFixed === 0) {
         return `${~~(newValue)} ${isMB ? 'MB' : 'GB'}`;
      } else {
         return `${(newValue).toFixed(1)} ${isMB ? 'MB' : 'GB'}`;
      }
   } catch (error) {
      return '0GB';
   }
};

export const arrayMoveIndex = (arr, fromIndex, toIndex) => {
   try {
      if (!fromIndex && !toIndex) {
         return arr;
      } else {
         const element = arr[fromIndex];
         arr.splice(fromIndex, 1);
         arr.splice(toIndex, 0, element);

         return arr;
      }
   } catch (error) {
      return arr;
   }
};

export const showReferral = () => {
   let isShow = true;

   try {
      const { memberData } = store.getState();

      if (memberData?.data?.data?.attributes?.isUserB2B === false) {
         isShow = false;
      }

   } catch (error) {
      isShow = true;
   }

   return isShow;
};

/**
 * 
 * @param {Date} expDate 
 * @returns {object} 
 * {
    isExpired: currentDate > expiredDate (0 days expired),
    isGracePeriod: currentDate > graceDate (31 days before expired),
    isGracePeriodInOneWeek: 7 days before grace period,
    diffDays: expiredDate - currentDate
  }
 */
export const getSimCardStatus = (modemData) => {
   let status = {
      isExpired: false,
      isGracePeriod: false,
      isGracePeriodInOneWeek: false,
      diffDays: null
   };

   try {
      const expiry_date = modemData?.attributes?.expiry_date;
      const grace_date = getMsisdnGraceDate(modemData);

      const currentDate = new Date().getTime();
      const expiredDate = new Date(expiry_date).getTime();
      const graceDate = new Date(grace_date).getTime();
      const diffTimeFromGraceDate = grace_date - currentDate;
      const diffDays = Math.ceil(diffTimeFromGraceDate / (1000 * 60 * 60 * 24));

      let isGracePeriodInOneWeek = false;

      if (grace_date) {
         const formattedGraceDate = new Date(grace_date);
         formattedGraceDate.setHours(0, 0, 0, 0);

         // Format one week from current date
         const oneWeekFromCurrentDate = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000));
         oneWeekFromCurrentDate.setHours(0, 0, 0, 0);

         // Validate if the condition timestamp match
         isGracePeriodInOneWeek = formattedGraceDate.getTime() == oneWeekFromCurrentDate.getTime();
      }

      status = {
         isExpired: currentDate > expiredDate,
         isGracePeriod: currentDate > graceDate,
         isGracePeriodInOneWeek: isGracePeriodInOneWeek,
         diffDays: diffDays || null
      };

      return status;
   } catch (error) {
      console.log('error@getExpiredSimCardStatus.MobileHelper', error);
      return status;
   }
};

export const getMsisdnGraceDate = (modemData) => {
   const expiryDate = modemData?.attributes?.expiry_date;
   const graceDate = modemData?.attributes?.graceDate;

   if (graceDate) {
      return new Date(graceDate);
   } else if (expiryDate) {
      const gracePeriodDate = new Date(expiryDate);
      const gracePeriodMonth = gracePeriodDate.getMonth();

      gracePeriodDate.setMonth(gracePeriodDate.getMonth() - 1);

      while (gracePeriodDate.getMonth() === gracePeriodMonth) {
         gracePeriodDate.setDate(gracePeriodDate.getDate() - 1);
      }

      return gracePeriodDate;
   }

   return false;
};

export const getFormattedDate = (date, format = 'DD MMMM YYY') => {
   const { language } = store.getState();
   moment.locale(language);
   const formatedDate = moment(date).format(format);

   return formatedDate;
};

export const getIsDisabledFeature = (simcardStatus, screen) => {
   let isDisabled = false;

   if (simcardStatus.isExpired) {
      isDisabled = true;
   } else if (simcardStatus.isGracePeriod) {
      isDisabled = screen == 'dashboard' ? false : true;
   }

   return isDisabled;
};
