import Axios from 'axios';
import { AxiosAdapter } from '../Config/AxiosAdapter.web';
import { DecryptAES } from './Cipher';
import {
   frIGUrl,
   frOAUTHClientID,
   frOAUTHClientSecret,
   frOAUTHClientIDMobile,
   baseUrlContent,
   baseUrlContentMs,
   baseUrlContentApiKey,
   baseUrlCoverageMs,
   baseUrlCoverageApiKey,
   baseUrlNewMember,
   baseUrlNewMemberApiKey,
   baseUrlNotification,
   baseUrlNotificationApiKey,
   baseUrlPackage,
   baseUrlPackageApiKey,
   baseUrlShipment,
   baseUrlShipmentApiKey,
   baseUrlSubscriptionsApiKey
} from '../Config/MainConfig.web';
import { store } from '../Config/Store.web';
import { deleteCookie, getBase64 } from './Function.web';
import { LazyRNImport } from './System.web';

export const getPackages = async (language) => {
   try {
      const config = {
         headers: {
            'channel': 'web',
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlPackageApiKey,
            'x-localization': language ? language : 'id'
         }
      };

      const url = `${baseUrlPackage}v1/packages`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      return error;
   }
};

export const getPackageAddOn = async (language, accessToken, is5GNetwork = false) => {
   try {
      const config = {
         headers: {
            Authorization: `Bearer ${accessToken}`,
            'channel': 'web',
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlPackageApiKey,
            'x-localization': language ? language : 'id'
         }
      };

      const url = `${baseUrlPackage}v1/packages-add-on${is5GNetwork ? '?is5GNetwork=true' : ''}`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      return false;
   }
};

export const getOrderLast = async (accessToken) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlShipmentApiKey,
            'x-localization': 'id'
         }
      };

      const url = `${baseUrlShipment}v1/orders?limit=1&sort_by=id&order_by=desc&status[]=OPEN&status[]=SHIPMENT&status[]=CONFIRMATION&orderClose=false&status[]=PAID&status[]=PENDING&order_type=PACKAGE`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      return null;
   }
};

export const getOrderLastDetail = async (accessToken, orderId) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlShipmentApiKey,
            'x-localization': 'id'
         }
      };

      const url = `${baseUrlShipment}v1/orders/${orderId}`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      return null;
   }
};

export const getOrderStatus = async (accessToken, isReload) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlShipmentApiKey,
            'x-localization': 'id'
         }
      };

      // Add custom header (Times) to ignore cache TTL
      if (isReload) {
         config.headers.Times = new Date().getTime();
      }

      const url = `${baseUrlShipment}v1/orders?limit=1&sort_by=id&order_by=desc&status[]=OPEN&status[]=SHIPMENT&status[]=CONFIRMATION&status[]=PENDING&orderClose=false&status[]=PAID&order_type=PACKAGEBUNDLING`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      console.log(error);
      console.log(error.response);

      return {
         isError: true
      };
   }
};

export const deleteOrder = async (accessToken, orderId) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': baseUrlShipmentApiKey
         }
      };

      const url = `${baseUrlShipment}v1/orders/${orderId}`;

      return await AxiosAdapter.delete(url, config);
   } catch (error) {
      console.log(error);
      console.log(error.response);

      let errorResponse = {
         isError: true
      };

      return errorResponse;
   }
};

export const getInfoModem = async (accessToken = false) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlNewMemberApiKey,
            'x-localization': 'id'
         }
      };

      const url = `${baseUrlNewMember}v2/members/device-router`;
      const result = await AxiosAdapter.get(url, config);

      const data = result.data.data;
      const token = result.data.token;
      const decryptData = JSON.parse(DecryptAES(data, token));

      result.data.data = decryptData;

      return result;
   } catch (error) {
      let errorResponse = {
         isError: true
      };

      return errorResponse;
   }
};

export const getMemberData = async (accessToken, email = false) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlNewMemberApiKey,
            'x-localization': 'id'
         }
      };

      if (email) {
         config.headers['email'] = email;
      }

      const url = `${baseUrlNewMember}v2/members`;
      const result = await AxiosAdapter.get(url, config);

      const data = result.data.data;
      const token = result.data.token;
      const decryptData = JSON.parse(DecryptAES(data, token));

      result.data.data = decryptData;

      return result;
   } catch (error) {
      return false;
   }
};

export const getNotification = async (accessToken, memberId, language, offset, limit) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'x-api-key': baseUrlNotificationApiKey,
            'x-localization': language ? language : 'id'
         }
      };

      const body = {
         memberId,
         sortBy: 'created',
         orderBy: 'desc',
         limit: limit,
         offset: offset
      };

      const url = `${baseUrlNotification}v2/notifications/inbox`;
      const result = await AxiosAdapter.post(url, body, config);
      const { data } = result.data;
      return data;
   } catch (error) {
      return false;
   }
};

export const getNotificationDetail = async (accessToken, notificationId, language) => {
   try {
      const config = {
         headers: {
            'x-api-Key': baseUrlNotificationApiKey,
            'x-localization': language ? language : 'id',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
         }
      };

      const url = `${baseUrlNotification}v2/notifications/inbox/${notificationId}`;
      const result = await AxiosAdapter.get(url, config);
      const { data } = result.data;
      return data;
   } catch (error) {
      return false;
   }
};

export const logout = async (accessToken, tokenId) => {
   // Clear cookies first
   deleteCookie('utm_source');
   deleteCookie('utm_medium');
   deleteCookie('utm_campaign');
   deleteCookie('utm_term');
   deleteCookie('utm_content');

   try {
      const config = {
         headers: {
            'am-clientid': frOAUTHClientID,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'iPlanetDirectoryPro': tokenId
         },
      };

      const url = `${frIGUrl}v1/sessions?_action=logout`;

      return await AxiosAdapter.post(url, null, config, 'forgerock:logout');
   } catch (error) {
      let errorResponse = {
         isError: true
      };

      return errorResponse;
   }
};

export const refreshToken = async (refreshToken, tokenId) => {
   try {
      const { registerEmailNameData } = store.getState();

      const config = {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'iPlanetDirectoryPro': tokenId
         },
      };
      const { Platform } = await LazyRNImport();

      if (registerEmailNameData) {
         config.headers['email'] = registerEmailNameData.email;
      }

      const isMobile = Platform.OS == 'web' ? false : true;
      const clientID = isMobile ? frOAUTHClientIDMobile : frOAUTHClientID;

      const url = `${frIGUrl}v1/oauth2/realms/tsel/access_token?grant_type=refresh_token&client_id=${clientID}&client_secret=${frOAUTHClientSecret}&refresh_token=${refreshToken}`;

      return await AxiosAdapter.post(url, null, config);
   } catch (error) {
      let errorResponse = {
         isError: true
      };

      throw errorResponse;
   }
};

export const getTutorialFile = async (accessToken, language, channel) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'channel': channel ? channel : 'web',
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlContentApiKey,
            'x-localization': language ? language : 'id'
         }
      }

      const url = `${baseUrlContent}v1/isetup/tutorial`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      return error.response
   }
};

export const submitNotifyMeIndibox = async (email, language) => {
   try {
      const config = {
         headers: {
            'channel': 'web',
            'x-api-key': baseUrlPackageApiKey,
            'x-localization': language ? language : 'id'
         }
      };

      const data = {
         'email': email
      };

      const url = `${baseUrlPackage}v1/packages/subscribe-indibox`;

      return await AxiosAdapter.post(url, data, config);
   } catch (error) {
      let errorResponse = {
         isError: true
      };

      return errorResponse;
   }
};

export const redeemReferralFromNotification = async (accessToken, callToAction) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': baseUrlSubscriptionsApiKey,
            'x-localization': 'id'
         }
      };

      const url = callToAction;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      return false;
   }
};

export const updateNotificationDetail = async (accessToken, notificationId) => {
   try {
      const config = {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': baseUrlNotificationApiKey,
            'x-localization': 'id'
         }
      };

      const body = {
         buttonStatus: 'USED'
      };

      const url = `${baseUrlNotification}v2/notifications/inbox/${notificationId}`;

      return await AxiosAdapter.put(url, body, config);
   } catch (error) {
      return false;
   }
};

export const postUploadAttachmentZendeskWidget = (value) => {
   return new Promise(async (resolve, reject) => {
      try {
         var base64File = '';
         const config = {
            headers: {
               'x-api-Key': baseUrlCoverageApiKey,
            },
         };

         getBase64(value).then(
            data => base64File = data.substr(data.indexOf(',') + 1)
         );

         const body = {
            file: base64File
         };

         const AxiosInstance = Axios.create({
            baseURL: baseUrlCoverageMs
         });

         await AxiosInstance.post(`zendesk/uploads?filename=${value?.name}​​​​​​​​`, body, config).then((res) => {
            resolve(res);
         }).catch(err => { throw err });

      } catch (error) {
         reject(false);
      }
   })
};

export const postTicketZendeskWidget = async (fullName, email, subject, description, customerName, attachmentToken) => {
   try {
      const config = {
         headers: {
            'x-api-Key': baseUrlCoverageApiKey
         }
      };

      const body = {
         ticket: {
            requester: {
               name: fullName,
               email: email
            },
            ticket_form_id: '360003061114',
            subject: subject,
            comment: {
               body: description,
               uploads: attachmentToken
            },
            custom_fields:
               [
                  { id: 360036659793, value: fullName },
                  { id: 360036659813, value: email },
                  { id: 360036659793, value: customerName }
               ]
            ,
            collaborators: [{ name: fullName, email: email }]
         }
      };

      const url = `${baseUrlCoverageMs}zendesk/tickets`;

      return await AxiosAdapter.post(url, body, config);
   } catch (error) {
      return false;
   }
};

export const getContentGeneralMs = async (id, language) => {
   try {
      const config = {
         headers: {
            'Channel': 'web',
            'x-api-key': baseUrlContentApiKey,
            'x-localization': language ? language : 'id'
         },
      };

      const url = `${baseUrlContentMs}v3/generals?key=${id}`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      console.log(error);
      console.log(error.response);

      let errorResponse = {
         isError: true
      };

      return errorResponse;
   }
};