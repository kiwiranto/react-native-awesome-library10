import { AxiosAdapter } from '../../Config/AxiosAdapter';
import {
   baseUrlPayment,
   baseUrlPaymentApiKey,
   baseUrlShipmentApiKey
} from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { EncryptAES } from '../../Helper/Cipher';
import { sentryCapture } from '../../Helper/SentryLib';

export const getPaymentMethod = async (grandTotal, menuLevelId, msisdn) => {
   try {
      const { accessTokenData } = store.getState();
      const encryptedMsisdn = EncryptAES(msisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-key': baseUrlPaymentApiKey,
         },
         params: {
            grandTotal: grandTotal,
            menuLevelId: menuLevelId,
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlPayment}v2/payments`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Payment@getPaymentMethod ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const checkCreditCardNumber = async (binNumber, paymentId) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-Key': baseUrlPaymentApiKey
         }
      };
      const url = `${baseUrlPayment}v1/payments/card/bin/${binNumber}/${paymentId}`;

      return await AxiosAdapter.get(url, config, 'midtrans:check-card-number');
   } catch (error) {
      sentryCapture(`APIService.Payment@checkCreditCardNumber ${JSON.stringify(error)}`, '');

      let errorResponse = {
         isError: true,
         isErrorInvalidCardNumber: error?.response?.data?.code == 400
      };

      return errorResponse;
   }
};

export const getCreditCardInstallmentOptions = async (grandTotal, paymentId) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-Key': baseUrlShipmentApiKey
         }
      };
      const url = `${baseUrlPayment}v2/payments/card/installment/${grandTotal}/${paymentId}`;

      return await AxiosAdapter.get(url, config, 'midtrans:cc-installment');
   } catch (error) {
      sentryCapture(`APIService.Payment@getCreditCardInstallmentOptions ${JSON.stringify(error)}`, '');

      let errorResponse = {
         isError: true,
         isErrorConnection: !error.response
      };

      return errorResponse;
   }
};

export const checkCreditCardNumberInstant = async (binNumber, paymentId) => {
   try {
      const config = {
         headers: {
            'x-api-Key': baseUrlPaymentApiKey
         }
      };

      const url = `${baseUrlPayment}v1/payments/card/instant/bin/${binNumber}/${paymentId}`;

      return await AxiosAdapter.get(url, config, 'midtrans:check-card-number');
   } catch (error) {
      sentryCapture(`APIService.Payment@checkCreditCardNumberInstant ${JSON.stringify(error)}`, '');

      let errorResponse = {
         isError: true,
         isErrorConnection: !error.response,
         isErrorInvalidCardNumber: error.response && error.response.data.code === 400
      };

      return errorResponse;
   }
};

export const getCreditCardInstallmentOptionsInstant = async (orderId, paymentId) => {
   try {
      const config = {
         headers: {
            'x-api-Key': baseUrlShipmentApiKey
         }
      };
      const url = `${baseUrlPayment}v1/payments/card/instant/installment/${orderId}/${paymentId}`;

      return await AxiosAdapter.get(url, config, 'midtrans:cc-installment');
   } catch (error) {
      sentryCapture(`APIService.Payment@getCreditCardInstallmentOptionsInstant ${JSON.stringify(error)}`, '');

      let errorResponse = {
         isError: true,
         isErrorConnection: !error.response
      };

      return errorResponse;
   }
};

export const getBalanceDANA = async (danaId) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlPaymentApiKey
         }
      };
      const dataParams = {
         'payment': {
            'id': danaId
         }
      };
      const url = `${baseUrlPayment}v1/payments/balance`;

      return await AxiosAdapter.post(url, dataParams, config);
   } catch (error) {
      sentryCapture(`APIService.Payment@getDanaBalanceMobile ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getAccessTokenDANA = async (danaId, authCode) => {

   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlPaymentApiKey
         }
      };
      const dataParams = {
         'payment': {
            'id': danaId
         },
         'authCode': authCode
      };
      const url = `${baseUrlPayment}v1/payments/access-token`;

      return await AxiosAdapter.post(url, dataParams, config);
   } catch (error) {
      sentryCapture(`APIService.Payment@getDanaAccessTokenMobile ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const unpairDANA = async (danaId) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlPaymentApiKey
         }
      };
      const url = `${baseUrlPayment}v1/payments/access-token?id=${danaId}`;

      return await AxiosAdapter.delete(url, config);
   } catch (error) {
      sentryCapture(`APIService.Payment@unpairDANA ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getPaymentDetailData = async (id) => {
   try {
      const config = {
         headers: {
            'x-api-key': baseUrlPaymentApiKey
         }
      };

      const url = `${baseUrlPayment}v1/get-payment-detail/${id}`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      return false;
   }
};