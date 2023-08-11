import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlConfig, baseUrlConfigApiKey } from '../../Config/MainConfig';
import { sentryCapture } from '../../Helper/SentryLib';

export const getFilterListData = async () => {
   try {
      const config = {
         headers: {
            'x-api-Key': baseUrlConfigApiKey
         }
      };

      const url = `${baseUrlConfig}v1/filter-config`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Config@getFilterListData ${JSON.stringify(error)}`, '');

      return false;
   }
};