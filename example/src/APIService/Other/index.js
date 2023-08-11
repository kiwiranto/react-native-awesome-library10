import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlPaymentApiKey } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { sentryCapture } from '../../Helper/SentryLib';

export const downloadInvoice = async (url) => {
   const { accessTokenData, memberData } = store.getState();

   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'mid': memberData?.id,
            'x-api-Key': baseUrlPaymentApiKey
         },
         responseType: 'blob'
      };

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Other@downloadInvoice ${JSON.stringify(error)}`, '');

      return false;
   }
};