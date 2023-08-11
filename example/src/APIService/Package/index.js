import DeviceInfo from 'react-native-device-info';

import { AxiosAdapter } from '../../Config/AxiosAdapter';
import {
   baseUrlPackage,
   baseUrlPackageApiKey
} from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { EncryptAES } from '../../Helper/Cipher';
import { sentryCapture } from '../../Helper/SentryLib';

const version = DeviceInfo.getVersion();

export const getPackageAddOnListData = async (msisdn) => {
   try {
      const { accessTokenData } = store.getState();
      const encryptedMsisdn = EncryptAES(msisdn, accessTokenData?.accessToken);
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlPackageApiKey,
            'x-client-version': version
         },
         params: {
            msisdn: encryptedMsisdn
         }
      };
      const url = `${baseUrlPackage}v3/packages-add-on`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Package@getPackageAddOnListData ${JSON.stringify(error)}`, '');

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