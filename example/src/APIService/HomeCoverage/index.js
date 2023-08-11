import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlHomeCoverage, baseUrlHomeCoverageApiKey } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { EncryptAES } from '../../Helper/Cipher';
import { sentryCapture } from '../../Helper/SentryLib';

export const getHomebaseLocationData = async (msisdn) => {
   try {
      const { accessTokenData } = store.getState();
      const encryptedMsisdn = EncryptAES(msisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-key': baseUrlHomeCoverageApiKey
         },
         params: {
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlHomeCoverage}v1/homebase-location`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.HomeCoverage@getHomebaseLocationData ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getHomebaseStatusData = async (msisdn) => {
   try {
      const { accessTokenData } = store.getState();
      const encryptedMsisdn = EncryptAES(msisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-key': baseUrlHomeCoverageApiKey
         },
         params: {
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlHomeCoverage}v1/homebase-status`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.HomeCoverage@getHomebaseStatusData ${JSON.stringify(error)}`, '');

      return false;
   }
};