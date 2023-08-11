import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlPackageDataOrder, baseUrlPackageDataOrderApiKey } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { EncryptAES } from '../../Helper/Cipher';
import { sentryCapture } from '../../Helper/SentryLib';

export const createOrderTopup = async (data) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-key': baseUrlPackageDataOrderApiKey
         }
      };
      const url = `${baseUrlPackageDataOrder}v1/submit-order`;

      return await AxiosAdapter.post(url, data, config);
   } catch (error) {
      sentryCapture(`APIService.PackageDataOrder@createOrderTopup ${JSON.stringify(error)}`, '');
      const errorData = error?.response?.data;

      return errorData;
   }
};

export const createOrderTopupWithoutLogin = async (data) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-api-key': baseUrlPackageDataOrderApiKey
         }
      };
      const url = `${baseUrlPackageDataOrder}v1/submit-order-without-login`;

      return await AxiosAdapter.post(url, data, config);
   } catch (error) {
      sentryCapture(`APIService.PackageDataOrder@createOrderTopupWithoutLogin ${JSON.stringify(error)}`, '');
      const errorData = error?.response?.data;

      return errorData;
   }
};

export const createOrderTopupOneClick = async (data) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-key': baseUrlPackageDataOrderApiKey
         }
      };
      const url = `${baseUrlPackageDataOrder}v1/submit-order-one-click`;

      return await AxiosAdapter.post(url, data, config);
   } catch (error) {
      sentryCapture(`APIService.PackageDataOrder@createOrderTopupOneClick ${JSON.stringify(error)}`, '');
      const errorData = error?.response?.data;

      return errorData;
   }
};

export const getTransactionListData = async (page, status) => {
   try {
      const { accessTokenData, modemData } = store.getState();
      const baseMsisdn = modemData?.attributes?.msisdn;
      const encryptedMsisdn = EncryptAES(baseMsisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-key': baseUrlPackageDataOrderApiKey
         },
         params: {
            page: page,
            per_page: 30,
            status: status,
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlPackageDataOrder}v1/orders`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.PackageDataOrder@getTransactionListData ${JSON.stringify(error)}`, '');
      const errorData = error?.response?.data;

      return errorData;
   }
};

export const getTransactionDetailData = async (id) => {
   try {
      const { accessTokenData, modemData } = store.getState();
      const baseMsisdn = modemData?.attributes?.msisdn;
      const encryptedMsisdn = EncryptAES(baseMsisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-key': baseUrlPackageDataOrderApiKey
         },
         params: {
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlPackageDataOrder}v1/orders/${id}`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.PackageDataOrder@getTransactionDetailData ${JSON.stringify(error)}`, '');
      const errorData = error?.response?.data;

      return errorData;
   }
};

export const readTransactionData = async (id) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-key': baseUrlPackageDataOrderApiKey
         }
      };

      const url = `${baseUrlPackageDataOrder}v1/read/${id}`;

      return await AxiosAdapter.put(url, null, config);
   } catch (error) {
      sentryCapture(`APIService.PackageDataOrder@readTransactionData ${JSON.stringify(error)}`, '');
      return false;
   }
};