import 'react-native-get-random-values';
import { Alert, Linking, Platform, Dimensions } from 'react-native';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js';
import moment from 'moment';
// import RNInsider from 'react-native-insider';
// import TagManager from 'react-gtm-module';

import { store } from '../Config/Store';
import { navigate } from '../Navigator/Navigator.mobile';
// import { LazyRNImport } from './System';

import {
   iconProfileApple,
   iconProfileEmail,
   iconProfileFacebook,
   iconProfileGoogle,
   iconProfileMsisdn
} from '../Assets/app/shared';
import { SET_COACH_MARK_DASHBOARD } from '../Config/Reducer';

export const formatRupiah = (number, prefix = false) => {
   try {
      if (typeof number == 'number') {
         number = number.toString();
      }

      var number_string = number.replace(/[^,\d]/g, '').toString(),
         split = number_string.split(','),
         spliter = split[0].length % 3,
         rupiah = split[0].substr(0, spliter),
         thousand = split[0].substr(spliter).match(/\d{3}/gi);

      let separator = false;
      if (thousand) {
         separator = spliter ? '.' : '';
         rupiah += separator + thousand.join('.');
      }

      rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
      return prefix == undefined ? rupiah : (rupiah ? 'Rp ' + rupiah : '');
   } catch (error) {
      return '-';
   }
};

export const formatMsisdn = (msisdn) => {
   if (msisdn) {
      if (msisdn.startsWith('62')) {
         return msisdn.replace('62', '0');
      } else {
         return msisdn;
      }
   } else {
      return msisdn;
   }
};

/**
 * Where this function is used to call the phone number carried by parameter.
 * @param phone
 */
export const openPhoneCall = (phone) => {
   let phoneNumber = phone;

   if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone}`;
   } else {
      phoneNumber = `telprompt:${phone}`;
   }

   Linking.canOpenURL(phoneNumber).then(supported => {
      if (!supported) {
         Alert.alert('Phone number is not available');
      } else {
         return Linking.openURL(phoneNumber);
      }
   }).catch(err => console.log(err));
};

export const getIsUserActive = (modemData) => {
   return modemData?.attributes?.service?.isActive ?? true;
};

export const getIsUserPostpaid = (modemData) => {
   return modemData?.attributes?.service?.isPostPaid ?? false;
};

export const getIsPurchaseExceedLimit = (modemData, addOnData) => {
   try {
      let result = true;

      const usageLimit = modemData?.attributes?.subscriberProfileBilling?.credit_limit_domestic || 0;
      const usedBalance = modemData?.attributes?.balance || 0;
      const productPrice = addOnData?.attributes?.price?.price || 0;

      const remainingBalance = usageLimit - usedBalance;

      if (remainingBalance >= 0 && productPrice <= remainingBalance) {
         result = false;
      }

      return result;
   } catch (error) {
      return false;
   }
};

export const isMeetUsageLimitConditions = (usedBalance = false, usageLimit = false, productPrice = false) => {
   try {
      let result = false;

      if (productPrice) {
         result = productPrice > (usageLimit - usedBalance);
      } else {
         result = (usedBalance / usageLimit) >= 0.8;
      }
      return result;
   } catch (error) {
      return false;
   }
};

// export const widthDevice = async () => {
//    const { Dimensions } = await LazyRNImport();

//    return Dimensions.get('window').width;
// };

// export const heightDevice = async () => {
//    const { Dimensions } = await LazyRNImport();

//    return Dimensions.get('window').height;
// };

export const regexOnlyNumber = /[^0-9]+/;
export const regexPhoneNumber = /^(08|02|62)\d{8,14}$/;
export const regexFullName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
export const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const regexPassword = /^(?=.*\d)(?=.*[^A-Za-z\d]).{8,}/;
export const regexLengthPassword = /^.{8,32}/; // Length 8-32 Character
export const regexTextCasePassword = /(?=.*[A-Z])(?=.*[a-z])/; // Lower and Uppercase
export const regexCombineNumberPassword = /(?=.*[0-9])/; // Combile With Number
export const regexURL = /(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
export const regexPasswordSsidAdvan = /(?=.*[€¥])/;
export const regexPasswordSsidZTE5G = /(?=.*[$€¥&*:;'",<>`])/;
export const regexSSIDPassword = /^[a-zA-Z0-9_.-]*$/;
export const regexTrimWhiteSpace = /^\s+|\s+$|\s+(?=\s)/;

export const getQueryString = (name, query) => {
   name = name.replace(/[[\]]/g, '\\$&');
   const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
   const results = regex.exec(query);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2]);
};

export const getFormattedAnalyticDate = (targetDate = null) => {
   let date = targetDate ? new Date(targetDate) : new Date();
   let days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
   let months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
   return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
};

export const getFormattedAnalyticTime = (targetDate = null) => {
   let date = targetDate ? new Date(targetDate) : new Date();
   return `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
};

export const logEventAnalytic = (dataLayer) => {
   const tagManagerArgs = {
      dataLayer: dataLayer
   };

   //  console.log('GTM Data Log: ', tagManagerArgs);
   // TagManager.dataLayer(tagManagerArgs);
};

export const deleteCookie = (name) => {
   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const getCookie = (name) => {
   var name = name + '=';
   var decodedCookie = decodeURIComponent(document.cookie);
   var ca = decodedCookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return '';
};

export const getGAClientID = () => {
   // window.ga((tracker) => {
   //     return tracker.get('clientId');
   // });

   try {
      return document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join('.');
   } catch (error) {
      return false;
   }
};

/**
 * @example <caption>Example usage of this function.</caption>
 * capitalizeEveryWord('batu ampar condet')
 * // return 'Batu Ampar Condet'
 * @param {string} sentence
 * @returns {string}
 */
export const capitalizeEveryWord = (sentence) => {
   const capitalizeWords = [];
   const words = sentence.toLowerCase().split(' ');

   // words.forEach(word => { // Performance issue
   //   const capitalLetters = word.charAt(0).toUpperCase() + word.slice(1)
   //   capitalizeWords.push(capitalLetters)
   // })

   for (let index = 0; index < words.length; index++) {
      const capitalLetters = words[index].charAt(0).toUpperCase() + words[index].slice(1);
      capitalizeWords.push(capitalLetters);
   }

   const result = capitalizeWords.join(' ');
   return result;
};

/**
 * @example <caption>Example usage of this function.</caption>
 * sanitizePhoneNumber('123 12321 - 1231 + 12312')
 * // return '12312321123112312'
 * @param {string} phoneNumber
 * @returns {string}
 */
export const sanitizePhoneNumber = (phoneNumber) => {
   const result = phoneNumber.replace(/[^0-9]/g, '');
   // const result = phoneNumber.replace(/-|\s|\+/g, '')
   return result;
};

/**
 * @example <caption>Example usage of this function.</caption>
 * onlyWordNumberAndSpaces('aasd dsa :123ds!@#')
 * // return 'aasd dsa 123ds'
 * @param {string} string
 * @returns {string}
 */
export const onlyWordNumberAndSpaces = (string) => {
   const result = string.replace(/[^\d\w\s]/g, '');
   return result;
};

/**
 * @example <caption>Example usage of this function.</caption>
 * shallowEqualObject({asd: 1}, {asd: 1})
 * // return true
 * shallowEqualObject({asd: 1}, {asd: 2})
 * // return false
 * @param {object} object
 * @param {object} comparisonObject
 * @returns {boolean}
 */
export const shallowEqualObject = (object, comparisonObject) => {
   const result = JSON.stringify(object) === JSON.stringify(comparisonObject);
   return result;
};

export const openUrl = async (url) => {
   // const { Linking } = await LazyRNImport();

   Linking.canOpenURL(url).then(supported => {
      if (supported) {
         return Linking.openURL(url);
      } else {
         console.log('Don\'t know how to open URI: ' + url);
      }
   }).catch(err => console.error('An error occurred', err));
};

export const openLink = async (url) => {
   Linking.openURL(url).catch((err) => {
      navigate('RedirectExternal', url);
      console.log('An error occurred', err);
   });
};

/* Dynamic sort array object by key */
export const compareValues = (key, order) => {
   return (a, b) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
         // property doesn't exist on either object
         return 0;
      }

      const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
         comparison = 1;
      } else if (varA < varB) {
         comparison = -1;
      }
      return (
         (order === 'desc') ? (comparison * -1) : comparison
      );
   };
};

/**
    * Use this for sort the array 
    * @param {Array} dataArray : array data
    * @param {string} key : key of object
    * @param {string} order : sort by asc or desc, default asc 
*/
export const sortArray = (dataArray, key, order = 'asc') => {
   return dataArray.sort(compareValues(key, order));
};

/**
 *
 * @param string
 * @param maxLength
 * @param start
 * @returns {string|*}
 */
export function createEllipsis(string, maxLength, start) {
   return string && string.length > maxLength ? `${string.substring(start, maxLength)}...` : string;
}

export const getMemberModem = (memberData) => {
   let memberDevices = memberData.attributes.devices;
   let modem = null;

   if (memberDevices.length) {
      memberDevices.forEach(item => {
         if (item.deviceType.toUpperCase() != 'INDIBOX') {
            modem = item;
         }
      });
   }

   return modem;
};

export function checkMsisdnPrefix(msisdn) {
   let currentMsisdn = msisdn;

   // Fix prefix 62
   if (currentMsisdn.startsWith('62')) {
      currentMsisdn = currentMsisdn.replace('62', '0');
   }

   // Get prefix
   currentMsisdn = currentMsisdn.substring(0, 4);

   // Define list invalid prefix
   const validMsisdnPrefix = [
      '0817',
      '0818',
      '0819',
      '0859',
      '0877',
      '0878',
      '0881',
      '0882',
      '0883',
      '0884',
      '0885',
      '0886',
      '0887',
      '0888',
      '0889',
      '0895'
   ];

   // Check prefix
   return !validMsisdnPrefix.includes(currentMsisdn);
};

export function checkMsisdnPrefixTsel(msisdn) {
   let currentMsisdn = msisdn;

   // Fix prefix 62
   if (currentMsisdn.startsWith('62')) {
      currentMsisdn = currentMsisdn.replace('62', '0');
   }

   // Get prefix (first 4 characters)
   currentMsisdn = currentMsisdn.substring(0, 4);

   // Define list telkomsel prefix
   const tselPrefix = [
      '0811',
      '0812',
      '0813',
      '0821',
      '0822',
      '0823',
      '0851',
      '0852',
      '0853'
   ];

   // Check prefix
   return tselPrefix.includes(currentMsisdn);
};

export const generateCodeChallengeVerifier = () => {
   let codeEncoder = (words) => {
      return CryptoJS.enc.Base64.stringify(words).replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '');
   };
   let codeVerifier = codeEncoder(CryptoJS.lib.WordArray.random(50));
   let codeChallenge = codeEncoder(CryptoJS.SHA256(codeVerifier));

   return { codeChallenge: codeChallenge, codeVerifier: codeVerifier };
};

export const getTime = () => {
   return new Date().getTime();
};

export const getDurationSecond = (timeStart, timeEnd) => {
   return Math.round((timeEnd - timeStart) / 1000);
};

export const getImageHeight = (imageUrl, dimensions, padding = 0) => {
   let imageHeight = false;
   let imageBannerSplit = imageUrl ? imageUrl.split('-') : [];

   if (imageBannerSplit.length) {
      let imageBannerSize = imageBannerSplit[imageBannerSplit.length - 1];
      imageBannerSize = imageBannerSize.split('^');

      if (imageBannerSize.length == 2) {
         let imageBannerWidth = imageBannerSize[0];
         let imageBannerHeight = imageBannerSize[1].replace('.png', '').replace('.jpeg', '').replace('.jpg', '');
         let deviceWidth = dimensions.get('window').width - padding;
         let AspectRatio = imageBannerWidth / imageBannerHeight;

         imageHeight = parseInt(deviceWidth / AspectRatio);
      }
   }
   return imageHeight;
};

export const parseJWT = (token) => {
   try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const base64Buffer = Buffer.from(base64, 'base64');
      const jsonPayload = decodeURIComponent(
         base64Buffer
            .toString()
            .split('')
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join('')
      );

      return JSON.parse(jsonPayload);
   } catch (error) {
      console.log(error);
      return null;
   }
};

export const getIsAccessTokenExpired = (accessToken) => {
   try {
      const accessTokenExpTimestamp = parseJWT(accessToken).exp;
      const currentTimestamp = Math.round(Date.now() / 1000);

      if (accessTokenExpTimestamp && typeof accessTokenExpTimestamp === 'number') {
         return accessTokenExpTimestamp <= currentTimestamp;
      }
      console.log('Invalid data');
   } catch (error) {
      console.log(error);
      return true;
   }
};


export const handleBackButton = (tagEvent, param, value) => {
   try {
      // RNInsider.tagEvent(tagEvent).addParameterWithString(param, value).build();
      navigate('Dashboard');
      return true;
   } catch (error) {
      console.log('handleBackButton', error.message);
   }
};

/**
 *
 * @param version
 * @returns {number}
 */
export const formatAppVersion = (version) => parseInt(version.replace(/[^0-9]/g, ''), 10);

/**
 *
 * @param formatedAppVersion
 * @returns {string|*}
 */
export const fixedDigitAppVersion = (formatedAppVersion) => {
   if (formatedAppVersion.toString().length === 3) {
      return `${formatedAppVersion.toString()}0`;
   }
   return formatedAppVersion;
};

export const getRandomIdentifier = () => {
   console.log('sss UUID:', uuidv4());
   return CryptoJS.AES.encrypt(nanoid() + Date.now(), 'R@HASIA2K22').toString();
};

export const lowercaseObjectKeys = (obj) => {
   return Object.keys(obj).reduce((destination, key) => {
      destination[key.toLowerCase()] = obj[key];
      return destination;
   }, {});
};

export const getUserAccountData = () => {
   const { loginProviderData, memberData } = store?.getState();
   const attributes = memberData?.data?.data?.attributes;
   const loginProvider = loginProviderData?.provider;

   let account = '';
   let fullName = '';
   let icon = iconProfileEmail;

   switch (loginProvider) {
      case 'google':
         account = attributes?.googleAccount;
         fullName = attributes?.googleFullname;
         icon = iconProfileGoogle;
         break;

      case 'facebook':
         account = attributes?.facebookAccount;
         fullName = attributes?.facebookFullname;
         icon = iconProfileFacebook;
         break;

      case 'apple':
         account = attributes?.appleAccount;
         fullName = account?.split('@')?.[0];
         icon = iconProfileApple;
         break;

      case 'email':
         account = attributes?.emailAccount;
         fullName = attributes?.fullname;
         icon = iconProfileEmail;
         break;

      case 'msisdn':
         account = attributes?.mobileIdentifierId;
         fullName = attributes?.mobileFullname;
         icon = iconProfileMsisdn;
         break;

      default:
         account = attributes?.emailAccount;
         fullName = attributes?.fullname;
         icon = iconProfileEmail;
         break;
   };

   return {
      account: account,
      fullname: fullName,
      icon: icon
   };
};

export const adjustSize = (size) => {
   return size + 2;
};

export const getIsMsisdnExpired = (modemData) => {
   let expiryDate = modemData?.attributes?.expiry_date;
   let isExpired = false;

   if (expiryDate) {
      const expiredTime = new Date(expiryDate).getTime();
      const currentTime = new Date().getTime();
      isExpired = currentTime > expiredTime;
   }

   return isExpired;
};

export const getIsMsisdnGracePeriod = (modemData) => {
   let gracePeriodDate = getMsisdnGraceDate(modemData);
   let isGracePeriod = false;

   if (gracePeriodDate) {
      const gracePeriodTime = new Date(gracePeriodDate).getTime();
      const currentTime = new Date().getTime();
      isGracePeriod = currentTime > gracePeriodTime;
   }

   return isGracePeriod;
};

export const getIsMsisdnGracePeriodInOneWeek = (modemData) => {
   let weekToGraceDate = modemData?.attributes?.weekToGraceDate;
   let isGracePeriodInOneWeek = false;

   try {
      if (weekToGraceDate) {
         // Format grace date
         const formattedDate = new Date(weekToGraceDate);
         formattedDate.setHours(0, 0, 0, 0);

         // Format one week from current date
         const currentDate = new Date();
         currentDate.setHours(0, 0, 0, 0);

         // Validate if the condition timestamp match
         isGracePeriodInOneWeek = formattedDate.getTime() == currentDate.getTime();
      }
   } catch (error) {
      console.log(error);
   }

   return isGracePeriodInOneWeek;
};

export const getMsisdnGraceDate = (modemData) => {
   const expiryDate = modemData?.attributes?.expiry_date;
   const graceDate = modemData?.attributes?.graceDate;

   if (graceDate) {
      // Get from BE if available
      return new Date(graceDate);
   } else if (expiryDate) {
      // calculate manually if not available
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

export const getIsEligibleHome = (modemData) => {
   const isEligibleHome = modemData?.attributes?.isEligibleHome ?? false;

   return isEligibleHome;
};

export function getFormattedDate(date, targetFormat, sourceFormat = false) {
   const language = store.getState().language;
   return sourceFormat ?
      moment(date, sourceFormat).locale(language).format(targetFormat) :
      moment(date).locale(language).format(targetFormat);
};

export const dynamicHeight = (size) => {
   const { height } = Dimensions.get('window');
   return height * size / 100;
};

export const dynamicWidth = (size) => {
   const { width } = Dimensions.get('window');
   return width * size / 100;
};

export const isEmpty = (value) => {
   return (
      value === null ||
      value === undefined ||
      value === 0 ||
      value === false ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
   );
};

export const handleCoachmarkGlobal = (index = false, scroll = false, choose = false, offsite = 0, mainScrollView, positionCoachmark, coachmarks) => {
   const scrollCoachmark = (idx, offsite) => {
      mainScrollView.scrollTo({ x: 0, y: positionCoachmark[idx] - offsite });
      setTimeout(() => {
         coachmarks[idx]?.show();
      }, 300);
   };

   const coachmark = (idx) => {
      coachmarks[idx]?.show();
   };

   switch (choose) {
      case 'skip': scrollCoachmark(index, offsite);
         break;
      case 'done': mainScrollView.scrollTo({ x: 0, y: 0 }); store.dispatch({ type: SET_COACH_MARK_DASHBOARD, dashboard: 'done' });
         break;
      default: (scroll) ? scrollCoachmark(index, offsite) : coachmark(index);
         break;
   };
}
