import Axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import CookieManager from '@react-native-cookies/cookies';
import DeviceInfo from 'react-native-device-info';

import { ssoTokenHandler, tokenHandler } from './Auth';
import { softwareStage } from './MainConfig';
import { SET_AXIOS_CACHE_STORAGE, LOGOUT } from './Reducer';
import { store } from './Store';
import MiddlewareLog, { ReThrowAxiosError } from '../Helper/MiddlewareLog';
import { navigate } from '../Navigator/Navigator.mobile';
import { EncryptAES } from '../Helper/Cipher';
// import { getQueryString } from '../Helper/Function';

/** Included caching by services **/
const includedUrlRegexList = [
   '/content/'
];

const _overrideStorageAdapter = () => {
   return {
      setItem: (key, val) => {
         let currentStore = store.getState().axiosCacheStorage;

         store.dispatch({
            type: SET_AXIOS_CACHE_STORAGE,
            data: {
               ...currentStore,
               [key]: val
            },
         })
         return true;
      },
      getItem: (key) => {
         try {
            return store.getState().axiosCacheStorage[key];
         } catch (error) {
            // Cache not found
            return false;
         }
      },
      removeItem: (key) => {
         let currentStore = store.getState().axiosCacheStorage;

         delete currentStore[key];

         store.dispatch({
            type: SET_AXIOS_CACHE_STORAGE,
            data: currentStore
         });

         return true;
      }
   };
};

let isRefreshingToken = false;
let requestsQueue = [];

const overrideStorageAdapter = _overrideStorageAdapter();

const isEncryptedMsisdn = (msisdn) => {
   const regexEncryptedPhoneNumber = /\b(62|08).*/;
   return !regexEncryptedPhoneNumber.test(msisdn);
};

const _AxiosAdapter = () => {
   const cache = setupCache({
      maxAge: 5000,
      store: overrideStorageAdapter,
      debug: softwareStage ? true : false,
      exclude: { query: false }
   });

   const adapter = Axios.create({
      adapter: cache.adapter
   });

   const axios = Axios.create();

   // Intercept current request, if there is error auth from BE, try to check token and refresh it
   axios.interceptors.response.use(
      (response) => response,
      async (error) => {
         const originalRequest = error.config;
         const errorCode = error?.response?.data?.code || '';

         if (errorCode?.toString().includes('AUTH') || errorCode === 'AUTH401') {
            if (!isRefreshingToken) {
               const tokenHandlerResult = await tokenHandler();
               if (tokenHandlerResult === 'on refresh') {
                  return await ssoTokenHandler();
               }

               if (!tokenHandlerResult) {
                  isRefreshingToken = false;

                  // Redirect back to login screen
                  navigate('LoginLanguage', { isLogout: true });

                  // Clear redux data and cookies
                  setTimeout(() => {
                     store.dispatch({ type: LOGOUT });
                     CookieManager.clearAll();
                  }, 500);
               } else {
                  const access_token = store.getState().accessTokenData.accessToken;

                  const paramsMsisdn = originalRequest.params.msisdn;
                  const paramsDataMsisdn = originalRequest.params.data;
                  const paramsEncryptedMsisdn = paramsMsisdn || paramsDataMsisdn;
                  const isEncrypted = isEncryptedMsisdn(paramsEncryptedMsisdn) === true;
                  const validateMsisdnFamilyUrl = originalRequest.url.toString().includes('subscriptions/validate/msisdn-family');
                  const isNeedReplaceMsisdn = (paramsEncryptedMsisdn || validateMsisdnFamilyUrl) && isEncrypted;

                  if (isNeedReplaceMsisdn) {
                     const msisdn = store.getState()?.modemData?.attributes?.msisdn;
                     const newMsisdn = EncryptAES(msisdn, access_token);
                     const replacedMsisdn = paramsEncryptedMsisdn.replace(paramsEncryptedMsisdn, newMsisdn);

                     if (paramsMsisdn) {
                        originalRequest.params.msisdn = replacedMsisdn;
                     } else {
                        originalRequest.params.data = replacedMsisdn;
                     }
                  }

                  isRefreshingToken = false;
                  originalRequest.headers.Authorization = `Bearer ${access_token}`;
                  requestsQueue.forEach((req) => req(access_token));
                  requestsQueue = [];
                  return axios(originalRequest);
               }
            } else {
               isRefreshingToken = false;
               return new Promise((resolve) => {
                  requestsQueue.push(async (accessToken) => {
                     originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                     resolve(await axios(originalRequest));
                  });
               });
            }
         }
         return Promise.reject(error);
      }
   );

   const getMainHeaders = (url) => {
      const { language } = store.getState();

      if (!url.includes('ciam')) {
         return {
            'channel': 'mobile',
            // 'content-type': 'application/json',
            'x-localization': language
         };
      }

      return null;
   };

   const getAdditionalHeaders = (url) => {
      const { appVersionData } = store.getState();
      const nativeVersion = `${appVersionData?.nativeVersion ?? DeviceInfo.getVersion()}`;
      const codePushVersion = appVersionData?.codePushVersion;
      const appVersion = nativeVersion + (codePushVersion ? ` ${codePushVersion}` : '');

      const data = {
         'x-version': appVersion
      };

      if (url.includes('ciam')) {
         return data;
      } else {
         const { loginProviderData, memberData } = store.getState();

         if (loginProviderData) {
            data['lm'] = loginProviderData?.provider;
         }

         if (memberData) {
            data['frid'] = memberData?.data?.data?.attributes?.forgeRockId;
            data['mid'] = memberData?.data?.data?.id;
         }

         return data;
      }
   };

   return {
      get: async (url, config, type = 'global') => {
         const _match = RegExp(includedUrlRegexList.join('|')).exec(url);
         config = {
            ...config,
            headers: {
               ...config?.headers ? config?.headers : null,
               ...getMainHeaders(url),
               ...getAdditionalHeaders(url),
               Referrer: 'www1.myorbit.id'
            }
         }

         try {
            if (_match) {
               const startMS = new Date().getTime();
               let result = await adapter({
                  url: url,
                  ...config,
               }).catch(async (error) => {
                  let responseTime = new Date().getTime() - startMS;
                  MiddlewareLog(error, type, responseTime);
                  throw new ReThrowAxiosError(error, error.response);
               })

               let responseTime = new Date().getTime() - startMS;
               MiddlewareLog(result, type, responseTime);
               return result;
            } else {
               const startMS = new Date().getTime();
               let result = await axios.get(url, config).catch(async (error) => {
                  let responseTime = new Date().getTime() - startMS;
                  MiddlewareLog(error, type, responseTime);
                  throw new ReThrowAxiosError(error, error.response);
               });

               let responseTime = new Date().getTime() - startMS;
               MiddlewareLog(result, type, responseTime);
               return result;
            }
         } catch (error) {
            throw new ReThrowAxiosError(error, error.response);
         }
      },
      post: async (url, body, config, type = 'global') => {
         config = {
            ...config,
            headers: {
               ...config?.headers ? config?.headers : null,
               ...getMainHeaders(url),
               ...getAdditionalHeaders(url),
               Referrer: 'www1.myorbit.id'
            }
         }

         try {
            let startMS = new Date().getTime();
            let result = await axios.post(url, body, config).catch(async (error) => {
               let responseTime = new Date().getTime() - startMS;

               MiddlewareLog(error, type, responseTime);
               throw new ReThrowAxiosError(error, error.response);
            });

            let responseTime = new Date().getTime() - startMS;
            MiddlewareLog(result, type, responseTime);
            return result;
         } catch (error) {
            throw new ReThrowAxiosError(error, error.response);
         }
      },
      put: async (url, body, config, type = 'global') => {
         config = {
            ...config,
            headers: {
               ...config?.headers ? config?.headers : null,
               ...getMainHeaders(url),
               ...getAdditionalHeaders(url),
               Referrer: 'www1.myorbit.id'
            }
         }

         try {
            const startMS = new Date().getTime();
            let result = await axios.put(url, body, config).catch(async (error) => {
               let responseTime = new Date().getTime() - startMS;
               MiddlewareLog(error, type, responseTime);
               throw new ReThrowAxiosError(error, error.response);
            });

            let responseTime = new Date().getTime() - startMS;
            MiddlewareLog(result, type, responseTime);
            return result;
         } catch (error) {
            throw new ReThrowAxiosError(error, error.response);
         }
      },
      delete: (url, config, type = 'global') => {
         config = {
            ...config,
            headers: {
               ...config?.headers ? config?.headers : null,
               ...getMainHeaders(url),
               ...getAdditionalHeaders(url),
               Referrer: 'www1.myorbit.id'
            }
         }

         return axios.delete(url, config);
      }
   };
};

export const AxiosAdapter = _AxiosAdapter();
