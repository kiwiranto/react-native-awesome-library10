import { AxiosAdapter } from "../../../Config/AxiosAdapter";
import { baseUrlHomeCoverageApiKey, baseUrlHomeCoverage } from "../../../Config/MainConfig";
import { EncryptAES } from "../../../Helper/Cipher";
import { sentryCapture } from "../../../Helper/SentryLib";

export const getHomebaseLocation = async (accessToken, msisdn) => {
   try {
      const encryptedMsisdn = EncryptAES(msisdn, accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': baseUrlHomeCoverageApiKey
         },
         params: {
            msisdn: encryptedMsisdn
         }
      };

      const url = `${baseUrlHomeCoverage}v1/homebase-location`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`HomebaseTransitionScreen.action@getHomebaseLocation ${JSON.stringify(error)}`, 'Gagal mendapatkan home location data');
      return error.response;
   }
};