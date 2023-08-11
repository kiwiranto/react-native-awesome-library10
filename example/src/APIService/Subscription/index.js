import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlSubscriptionsMs, baseUrlSubscriptionsApiKey } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { EncryptAES } from '../../Helper/Cipher';
import { sentryCapture } from '../../Helper/SentryLib';

export const getQuotaListData = async (msisdn, cancelToken = null) => {
   try {
      const { accessTokenData } = store.getState();
      const encryptedMsisdn = EncryptAES(msisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlSubscriptionsApiKey
         },
         params: {
            msisdn: encryptedMsisdn
         },
         timeout: 60000,
         cancelToken: cancelToken
      };
      const url = `${baseUrlSubscriptionsMs}v2/subscriptions/quota`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Subscription@getQuotaListData ${JSON.stringify(error)}`, '');

      return false;
   }
};