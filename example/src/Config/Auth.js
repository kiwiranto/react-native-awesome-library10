import CookieManager from '@react-native-cookies/cookies';
import { AxiosAdapter } from './AxiosAdapter';
import {
   frIGUrl,
   frOAUTHClientID,
   frOAUTHClientIDMobile,
   frOAUTHClientSecret,
   frOAUTHRedirectUrl,
   frOAUTHScope
} from './MainConfig';
import { LOGOUT } from './Reducer';
import { store } from './Store';
import { getIsAccessTokenExpired, getQueryString } from '../Helper/Function';
import { LazyRNImport } from '../Helper/System';
import { navigate } from '../Navigator/Navigator.mobile';

// Initiate cache map
const refreshTokenCache = new Map();

// Flow Refresh Token
const _handlerManageRefreshTokenUrl = async (url, tokenId) => {
   try {
      const { registerEmailNameData } = store.getState();

      const config = {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            iPlanetDirectoryPro: tokenId
         }
      };

      if (registerEmailNameData) {
         config.headers.email = registerEmailNameData.email;
      }

      // Check the url in the cache map
      let result = refreshTokenCache.get(url);

      if (typeof result === 'undefined') {
         // Set default value for current request, not waiting for response
         refreshTokenCache.set(url, 'on refresh');

         // Set the actual value for current request
         result = await AxiosAdapter.post(url, null, config);
         refreshTokenCache.set(url, result);
      }

      return result;
   } catch (error) {
      // Failed refresh token, e.g 400 'Invalid Grant'
      return false;
   }
};

const _handlerRefreshToken = async () => {
   const { accessTokenData, loginTokenIdData } = store.getState();

   try {
      if (accessTokenData) {
         const { Platform } = await LazyRNImport();
         const currentRefreshToken = accessTokenData?.refreshToken;
         const isMobile = Platform.OS !== 'web';
         const clientID = isMobile ? frOAUTHClientIDMobile : frOAUTHClientID;

         const url = `${frIGUrl}v1/oauth2/realms/tsel/access_token?grant_type=refresh_token&client_id=${clientID}&client_secret=${frOAUTHClientSecret}&refresh_token=${currentRefreshToken}`;
         const result = await _handlerManageRefreshTokenUrl(url, loginTokenIdData);

         if (result === 'on refresh') {
            return 'on refresh';
         } else if (result?.status === 200) {
            // Save updated access and refresh token
            store.dispatch({
               type: 'SET_ACCESS_TOKEN',
               accessToken: result?.data?.access_token,
               refreshToken: result?.data?.refresh_token,
               idToken: result?.data?.id_token,
               expiresIn: result?.data?.expires_in
            });

            // Success refresh token, delete current url list from cache map
            refreshTokenCache.delete(url);

            return true;
         } else {
            // Check latest access token
            const isAccessTokenExpired = await getIsAccessTokenExpired(store?.getState()?.accessTokenData?.accessToken);
            return !isAccessTokenExpired;
         }
      } else {
         return false;
      }
   } catch (error) {
      return false;
   }
};

// Flow SSO Token
const _handleGetSessionCode = async (tokenId) => {
   const url = `${frIGUrl}v1/oauth2/realms/tsel/authorize?client_id=${frOAUTHClientIDMobile}&redirect_uri=${frOAUTHRedirectUrl}&response_type=code&nonce=true&scope=${frOAUTHScope.replace(' ', '%20')}&csrf=${tokenId}`;

   let result;
   try {
      result = await AxiosAdapter.get(url);
   } catch (e) {
      console.log('error@_handleGetSessionCode', e.response);
      logoutHandler();
   }

   try {
      const isResultSuccess = result?.request?.responseURL && !result.isError;

      if (isResultSuccess) {
         return await _handleGetAccessToken(result?.request?.responseURL, tokenId);
      } else {
         return false;
      }
   } catch (error) {
      console.log('error@_handleGetSessionCode.Auth.js.Config', error);
      return false;
   }
};

const _handleGetAccessToken = async (redirectUrl) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
         }
      };
      const code = getQueryString('code', redirectUrl);
      const url = `${frIGUrl}v1/oauth2/realms/tsel/access_token?grant_type=authorization_code&redirect_uri=${frOAUTHRedirectUrl}&code=${code}&client_id=${frOAUTHClientIDMobile}&client_secret=${frOAUTHClientSecret}`;
      const result = await AxiosAdapter.post(url, {}, config);
      const isResultSuccess = !result.isError && result?.status === 200;

      if (isResultSuccess) {
         // Save updated access and refresh token
         store.dispatch({
            type: 'SET_ACCESS_TOKEN',
            accessToken: result?.data?.access_token,
            refreshToken: result?.data?.refresh_token,
            idToken: result?.data?.id_token,
            expiresIn: result?.data?.expires_in
         });

         return true;
      } else {
         return false;
      }
   } catch (error) {
      return false;
   }
};

// Logout Handler
const logoutHandler = () => {
   // Redirect back to login screen
   navigate('LoginLanguage', { isLogout: true });

   // Clear redux data and cookies
   setTimeout(() => {
      store.dispatch({ type: LOGOUT });
      CookieManager.clearAll();
   }, 500);
};

// SSO Token Handler
export const ssoTokenHandler = async () => {
   // If refresh token failed or refresh token decoded attribute 'exp' is expired, 
   // try to get new access token via SSO token 
   const { loginTokenIdData } = store.getState();
   const ssoTokenHandler = await _handleGetSessionCode(loginTokenIdData);

   if (ssoTokenHandler) {
      return ssoTokenHandler;
   } else {
      logoutHandler();
      return false;
   }
};

// Main Token Handler
export const tokenHandler = async () => {
   const { accessTokenData } = store.getState();

   const isRefreshTokenExpired = getIsAccessTokenExpired(accessTokenData?.refreshToken);

   if (isRefreshTokenExpired) {
      return await ssoTokenHandler();
   } else {
      // Refresh token decoded attribute 'exp' is still valid, try to refresh token
      const refreshTokenHandler = await _handlerRefreshToken();

      if (refreshTokenHandler) {
         // If refresh token succeed, return the process
         return refreshTokenHandler;
      } else {
         return await ssoTokenHandler();
      }
   }
};