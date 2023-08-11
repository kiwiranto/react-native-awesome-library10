import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlUsageStatistic, baseUrlUsageStatisticApiKey } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { EncryptAES } from '../../Helper/Cipher';
import { sentryCapture } from '../../Helper/SentryLib';

export const getUsageStatisticData = async (start_date, end_date) => {
   try {
      const { accessTokenData, modemData } = store.getState();
      const baseMsisdn = modemData?.attributes?.msisdn;
      const encryptedMsisdn = EncryptAES(baseMsisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-key': baseUrlUsageStatisticApiKey
         },
         params: {
            msisdn: encryptedMsisdn,
            start_date: start_date,
            end_date: end_date
         },
         timeout: 2000
      };
      const url = `${baseUrlUsageStatistic}v1/statistics`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.UsageStatistic@getUsageStatisticData ${JSON.stringify(error)}`, '');

      return false;
   }
};