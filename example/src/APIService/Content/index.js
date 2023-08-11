import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlContentMs, baseUrlContentApiKey } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { sentryCapture } from '../../Helper/SentryLib';

export const getContentGeneral = async (id) => {
   try {
      const config = {
         headers: {
            'x-api-key': baseUrlContentApiKey
         }
      };

      const url = `${baseUrlContentMs}v3/generals?key=${id}`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Content@getContentGeneral ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getNPSSurveyData = async (data) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlContentApiKey
         }
      };
      const body = {
         'msisdn': data?.msisdn,
         'misc': {
            'interaction_name': 'interaksi',
            'language_type_id': 'ind',
            'language_type_en': 'en',
            'customer_name_id': data?.fullname,
            'customer_name_en': data?.fullname,
            'name_of_surveyed_interaction_id': data?.interactionType,
            'name_of_surveyed_interaction_en': data?.interactionType,
            'name_of_application_channel_id': 'My Orbit',
            'name_of_application_channel_en': 'My Orbit',
            'customer_type': 'telkomsel',
            'customer_subtype': 'employee',
            'msisdn_brand': 'simpati',
            'hvc_flag': 'Silver'
         }
      };
      const url = `${baseUrlContentMs}v3/survey/validation`;

      return await AxiosAdapter.post(url, body, config);
   } catch (error) {
      sentryCapture(`APIService.Content@getNPSSurveyData ${JSON.stringify(error)}`, '');

      return false;
   }
};