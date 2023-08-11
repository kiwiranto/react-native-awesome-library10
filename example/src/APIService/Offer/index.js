import deviceInfoModule from 'react-native-device-info';

import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlOffer, baseUrlOfferApiKey } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { EncryptAES } from '../../Helper/Cipher';
import { sentryCapture } from '../../Helper/SentryLib';

const version = deviceInfoModule.getVersion();

export const getMainPackageAddOnListData = async (msisdn) => {
   try {
      const { accessTokenData } = store.getState();
      const encryptedMsisdn = EncryptAES(msisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlOfferApiKey,
            'x-client-version': version
         },
         params: {
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlOffer}v2/package-special`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Offer@getMainPackageAddOnListData ${JSON.stringify(error)}`, '');

      const isErrorInactive = error?.response?.data?.error_message?.member?.[0]?.toLowerCase()?.includes('non active');
      const isErrorOverLimit = error?.response?.data?.error_message?.msisdn?.[0]?.[0]?.toLowerCase() === 'over limit';

      const errorResponse = {
         isError: true,
         isErrorInactive: isErrorInactive,
         isErrorOverLimit: isErrorOverLimit
      };

      return errorResponse;
   }
};

export const getPackageAddOnCategoryListData = async (msisdn) => {
   try {
      const { accessTokenData } = store.getState();
      const encryptedMsisdn = EncryptAES(msisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-Key': baseUrlOfferApiKey
         },
         params: {
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlOffer}v1/categories`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Offer@getPackageAddOnCategoryListData ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getPackageAddOnListData = async (msisdn, menuLevel, queryString = '', cancelToken = null) => {
   try {
      const { accessTokenData } = store.getState();
      const encryptedMsisdn = EncryptAES(msisdn, accessTokenData?.accessToken);
      const encodedMsisdn = encodeURIComponent(encryptedMsisdn);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlOfferApiKey,
            'x-client-version': version
         },
         cancelToken: cancelToken
      };
      const url = `${baseUrlOffer}v1/data-package${menuLevel ? `/${menuLevel}` : ''}?msisdn=${encodedMsisdn}${queryString ? queryString : ''}`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Offer@getPackageAddOnListData ${JSON.stringify(error)}`, '');

      const isErrorInactive = error?.response?.data?.error_message?.member?.[0]?.toLowerCase() == 'the member subscriber status is non active';
      const isErrorOverLimit = error?.response?.data?.error_message?.msisdn?.[0]?.[0]?.toLowerCase() === 'over limit';

      const errorResponse = {
         isError: true,
         isErrorInactive: isErrorInactive,
         isErrorOverLimit: isErrorOverLimit
      };

      return errorResponse;
   }
};

export const getPackageAddOnDetailData = async (id, msisdn) => {
   try {
      const { accessTokenData } = store.getState();
      const encryptedMsisdn = EncryptAES(msisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlOfferApiKey,
            'x-client-version': version
         },
         params: {
            rebuy: id,
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlOffer}v1/data-package-detail`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Offer@getPackageAddOnDetailData ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getActiveOfferListData = async () => {
   try {
      const { accessTokenData, modemData } = store.getState();
      const baseMsisdn = modemData?.attributes?.msisdn;
      const encryptedMsisdn = EncryptAES(baseMsisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-Key': baseUrlOfferApiKey,
         },
         params: {
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlOffer}v1/list-active-offer`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Offer@getActiveOfferListData ${JSON.stringify(error)}`, '');

      return false;
   }
};