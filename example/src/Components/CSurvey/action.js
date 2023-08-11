import { baseUrlContent, baseUrlContentApiKey, baseUrlContentMs } from "../../Config/MainConfig";
import { AxiosAdapter } from "../../Config/AxiosAdapter";

export const getSurveyNPS = async (accessToken, interactionType, msisdn, custName ) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "x-api-Key": baseUrlContentApiKey,
      "Content-Type": "application/json",
      "channel": "mobile"
    }
  };

  const body = {
    "msisdn": msisdn,
    "misc": {
      "interaction_name": "interaksi",
      "language_type_id": "ind",
      "language_type_en": "en",
      "customer_name_id": custName,
      "customer_name_en": custName,
      "name_of_surveyed_interaction_id": interactionType,
      "name_of_surveyed_interaction_en": interactionType,
      "name_of_application_channel_id": "My Orbit",
      "name_of_application_channel_en": "My Orbit",
      "customer_type": "telkomsel",
      "customer_subtype": "employee",
      "msisdn_brand": "simpati",
      "hvc_flag": "Silver"
    }
  }

  const url = baseUrlContentMs + "v3/survey/validation";

  return await AxiosAdapter.post(url, body, config);
};

export const submitSurveyNPS = async (accessToken, dataParams) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "x-api-Key": baseUrlContentApiKey,
      "Content-Type": "application/json",
      "channel": "mobile"
    },
  };

  const url = baseUrlContentMs + "v3/survey";

  return await AxiosAdapter.post(url, dataParams, config);
};
