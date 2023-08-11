import moment from 'moment';
import { AxiosAdapter } from '../../Config/AxiosAdapter';
import {
   baseUrlMember,
   baseUrlMemberApiKey,
   baseUrlNewMember,
   baseUrlNewMemberApiKey
} from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { DecryptAES } from '../../Helper/Cipher';
import { sentryCapture } from '../../Helper/SentryLib';

export const getMemberData = async () => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlNewMemberApiKey
         }
      };
      const url = `${baseUrlNewMember}v2/members`;
      const result = await AxiosAdapter.get(url, config);

      const data = result.data.data;
      const token = result.data.token;
      const decryptData = JSON.parse(DecryptAES(data, token));

      result.data.data = decryptData;

      return result;
   } catch (error) {
      sentryCapture(`APIService.Member@getMemberData ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getMemberDeviceListData = async () => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlNewMemberApiKey
         }
      };
      const url = `${baseUrlNewMember}v2/members/device-router`;
      const result = await AxiosAdapter.get(url, config);

      const data = result?.data?.data;
      const token = result?.data?.token;
      const decryptData = JSON.parse(DecryptAES(data, token));

      result.data.data = decryptData;

      return result;
   } catch (error) {
      sentryCapture(`APIService.Member@getMemberDeviceListData ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getMemberDeviceData = async (id) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlNewMemberApiKey
         }
      };
      const url = `${baseUrlNewMember}v2/members/device-router?id=${id}`;
      const result = await AxiosAdapter.get(url, config);

      const data = result?.data?.data;
      const token = result?.data?.token;
      const decryptData = JSON.parse(DecryptAES(data, token));

      result.data.data = decryptData;

      return result;
   } catch (error) {
      sentryCapture(`APIService.Member@getMemberDeviceData ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const updatePrivacyPolicyAgreement = async () => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'x-api-key': baseUrlMemberApiKey
         }
      };
      const url = `${baseUrlMember}v1/members/member-policy`;
      const result = await AxiosAdapter.put(url, null, config);

      const data = result?.data?.data;
      const token = result?.data?.token;
      const decryptData = JSON.parse(DecryptAES(data, token));

      result.data.data = decryptData;

      return result;
   } catch (error) {
      sentryCapture(`APIService.Member@updatePrivacyPolicyAgreement ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const postPairingDate = async () => {
   const { accessTokenData, modemData } = store.getState();
   try {
      const { accessToken } = accessTokenData;
      const memberDeviceID = modemData.id;

      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-api-Key': baseUrlMemberApiKey,
            'x-localization': 'en',
            'Content-Type': 'application/json',
            'channel': 'mobile'
         },
         timeout: 60000
      };

      const body = {
         pairingDate: new Date(moment(moment().format('YYYY-MM-DD HH:mm')))
      };

      const url = baseUrlMember + 'v2/members/device-router/' + memberDeviceID;
      let result = await AxiosAdapter.put(url, body, config);

      const data = result.data.data;
      const token = result.data.token;
      const decryptData = JSON.parse(DecryptAES(data, token));

      result.data.data = decryptData;

      return result;
   } catch (error) {
      console.log('PairingScreen.action@postPairingDate', error.message);
      return false;
   }
};
