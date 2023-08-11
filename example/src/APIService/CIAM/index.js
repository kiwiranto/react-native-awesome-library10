import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { frIGUrl, frOAUTHClientIDMobile } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { sentryCapture } from '../../Helper/SentryLib';

export const logout = async (tokenId) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'am-clientid': frOAUTHClientIDMobile,
            'Content-Type': 'application/json',
            'iPlanetDirectoryPro': tokenId,
            'Authorization': `Bearer ${accessTokenData?.accessToken}`
         }
      };
      const url = `${frIGUrl}v1/sessions?_action=logout`;

      return await AxiosAdapter.post(url, null, config, 'forgerock:logout');
   } catch (error) {
      sentryCapture(`APIService.CIAM@logout ${JSON.stringify(error)}`, '');

      let errorResponse = {
         isError: true
      };

      return errorResponse;
   }
};