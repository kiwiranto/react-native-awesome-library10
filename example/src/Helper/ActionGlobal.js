import deviceInfoModule from 'react-native-device-info';
import moment from 'moment';

import { AxiosAdapter } from '../Config/AxiosAdapter';
import {
  frIGUrl,
  frOAUTHClientIDMobile,
  frOAUTHClientSecret,
  baseUrlPackageApiKey,
  baseUrlPackage,
  baseUrlShipment,
  baseUrlShipmentApiKey,
  baseUrlMemberApiKey,
  baseUrlMember,
  baseUrlNewMember,
  baseUrlNewMemberApiKey,
  baseUrlNotification,
  baseUrlNotificationApiKey,
  baseUrl,
  baseUrlContentApiKey,
  baseUrlSubscriptionsApiKey,
  baseUrlDevices,
  baseUrlDevicesApiKey,
  baseUrlContentMs,
  baseUrlCoverageMs,
  baseUrlCoverageApiKey,
  baseUrlSubscriptionsMs
} from '../Config/MainConfig';
import { SET_NETWORK_LOGGER } from '../Config/Reducer';
import { store } from '../Config/Store';
import { DecryptAES, EncryptAES } from './Cipher';
import { sentryCapture } from './SentryLib';

export const encKeyObj = ['esn', 'msisdn', 'ssid', 'password', 'passwordRouter', 'guestSsid', 'guestPassword', 'imei'];

const versionApp = deviceInfoModule.getVersion();
const mainConfig = {
  headers: {
    'x-api-Key': baseUrlCoverageApiKey
  }
};

export const getContentGeneralMs = async (id) => {
  try {
    const config = {
      headers: {
        'x-api-key': baseUrlContentApiKey
      }
    };

    const url = `${baseUrlContentMs}v3/generals?key=${id}`;

    return await AxiosAdapter.get(url, config);
  } catch (error) {
    console.log('Err- @getContentGeneralMs', error.response);
    return false;
  }
};

export const getPackages = async (language) => {
  const config = {
    headers: {
      'x-api-Key': baseUrlPackageApiKey,
      'x-localization': language,
      'Content-Type': 'application/json',
      channel: 'web'
    }
  };

  const url = baseUrlPackage + 'v1/packages';

  return await AxiosAdapter.get(url, config);
};

export const getPackageAddOn = async (language, accessToken, is5GNetwork = false) => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-api-Key': baseUrlPackageApiKey,
      'x-localization': language ? language : 'id',
      'Content-Type': 'application/json',
      channel: 'web'
    }
  };

  const url = baseUrlPackage + 'v1/packages-add-on' + `${is5GNetwork ? '?is5GNetwork=true' : ''}`;

  return await AxiosAdapter.get(url, config);
};

export const getPackageAddOnV2 = async (language, accessToken, msisdn, isReload = false) => {
  const config = {
    headers: {
      // Authorization: `Bearer ${accessToken}`,
      'x-api-Key': baseUrlPackageApiKey,
      'x-localization': language ? language : 'id',
      'Content-Type': 'application/json',
      'x-client-version': versionApp,
      channel: 'web'
    }
  };

  const queryString = `${msisdn ? `?msisdn=${msisdn}` : ''}${isReload ? `&time=${new Date().getTime()}` : ''}`;
  const url = `${baseUrlPackage}v2/packages-add-on${queryString}`;

  return await AxiosAdapter.get(url, config);
};

export const getPackageAddOnV3 = async (language, accessToken, msisdn) => {
  const encryptedMsisdn = EncryptAES(msisdn, accessToken);
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-api-Key': baseUrlPackageApiKey,
      'x-localization': language,
      'Content-Type': 'application/json',
      'x-client-version': versionApp,
      channel: 'app'
    },
    params: {
      msisdn: encryptedMsisdn
    }
  };

  const url = `${baseUrlPackage}v3/packages-add-on`;

  return await AxiosAdapter.get(url, config);
};

export const getOrderLast = async (accessToken, orderType = 'PACKAGE', orderStatusOnlyPaid = false) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-api-Key': baseUrlShipmentApiKey,
        'x-localization': 'en',
        'Content-Type': 'application/json'
      },
      timeout: 60000
    };

    const orderStatus = orderStatusOnlyPaid
      ? 'status[]=PAID'
      : 'status[]=OPEN&status[]=SHIPMENT&status[]=CONFIRMATION&status[]=PAID&status[]=PENDING';

    const url =
      baseUrlShipment +
      `v1/orders?limit=1&sort_by=id&order_by=desc&orderClose=false&${orderStatus}&order_type=${orderType}`;
    const result = await AxiosAdapter.get(url, config);

    return result;
  } catch (error) {
    sentryCapture(`ActionGlobal@getOrderLast ${JSON.stringify(error)}`, 'Gagal mendapatkan order last');

    return null;
  }
};

export const getOrderLastDetail = async (accessToken, orderId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-api-Key': baseUrlShipmentApiKey,
        'x-localization': 'en',
        'Content-Type': 'application/json'
      },
      timeout: 60000
    };

    const url = baseUrlShipment + 'v1/orders/' + orderId;
    const result = await AxiosAdapter.get(url, config);

    return result;
  } catch (error) {
    sentryCapture(`ActionGlobal@getOrderLastDetail ${JSON.stringify(error)}`, 'Gagal mendapatkan order last detail');

    return null;
  }
};

export const deleteOrder = async (accessToken, orderId) => {
  try {
    const config = {
      headers: {
        'x-api-key': baseUrlShipmentApiKey,
        Authorization: `Bearer ${accessToken}`
      }
    };

    const url = baseUrlShipment + 'v1/orders/' + orderId;

    return await AxiosAdapter.delete(url, config);
  } catch (error) {
    sentryCapture(`ActionGlobal@deleteOrder ${JSON.stringify(error)}`, 'Gagal delete order');

    let errorResponse = {
      isError: true
    };

    return errorResponse;
  }
};

export const getInfoModem = async (accToken = false, cancelToken = null) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accToken}`,
        'x-api-Key': baseUrlNewMemberApiKey,
        'x-localization': 'en',
        'Content-Type': 'application/json'
      },
      cancelToken: cancelToken
    };

    const url = baseUrlNewMember + 'v2/members/device-router';
    let resultGet = await AxiosAdapter.get(url, config);

    const data = resultGet.data.data;
    const token = resultGet.data.token;
    const decryptData = JSON.parse(DecryptAES(data, token));

    resultGet.data.data = decryptData;

    return resultGet;
  } catch (error) {
    // ToastHandler(language == "en" ? "Failed to get Modem Data!" : "Gagal mendapatkan Modem Data!")
    sentryCapture(`ActionGlobal@getInfoModem ${JSON.stringify(error)}`, 'Gagal mendapatkan info modem');

    console.log('PairingScreen.action@getInfoModem', error);
    return false;
  }
};

export const getMemberDeviceLite = async (accToken = false, cancelToken = null) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accToken}`,
        'x-api-Key': baseUrlNewMemberApiKey,
        'x-localization': 'en',
        'Content-Type': 'application/json'
      },
      cancelToken: cancelToken
    };

    const url = baseUrlNewMember + 'v2/members/device-router-lite';
    let resultGet = await AxiosAdapter.get(url, config);

    const data = resultGet.data.data;
    const token = resultGet.data.token;
    const decryptData = JSON.parse(DecryptAES(data, token));

    resultGet.data.data = decryptData;

    return resultGet;
  } catch (error) {
    // ToastHandler(language == "en" ? "Failed to get Modem Data!" : "Gagal mendapatkan Modem Data!")
    sentryCapture(`ActionGlobal@getInfoModem ${JSON.stringify(error)}`, 'Gagal mendapatkan info modem');

    console.log('PairingScreen.action@getInfoModem', error);
    return false;
  }
};

export const getMemberData = async (accessToken) => {
  try {
    const config = {
      headers: {
        'x-api-Key': baseUrlNewMemberApiKey,
        'x-localization': 'en',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    };

    const url = baseUrlNewMember + 'v2/members';
    let resultGet = await AxiosAdapter.get(url, config);

    const data = resultGet.data.data;
    const token = resultGet.data.token;
    const decryptData = JSON.parse(DecryptAES(data, token));

    resultGet.data.data = decryptData;

    return resultGet;
  } catch (error) {
    sentryCapture(`ActionGlobal@getMemberData ${JSON.stringify(error)}`, 'Gagal mendapatkan member data');
    console.log('Login.action@getMemberData', error);

    let errorResponse = {
      isError: true,
      errorMessage: error.message,
    };

    return errorResponse;
  }
};

export const submitCheckMemberExist = async (phoneNumber) => {
  try {
    const data = {
      'msisdn': phoneNumber
    };

    const config = {
      headers: {
        'x-api-Key': baseUrlMemberApiKey,
        'x-localization': 'id',
        'Content-Type': 'application/json'
      }
    };

    const url = baseUrlMember + 'v1/members/check';

    return await AxiosAdapter.post(url, data, config);
  } catch (error) {
    console.log(error);
    console.log(error.response);
    let errorRes = error?.response?.data;
    let message = '';

    if (errorRes.code == 'VLD00' && errorRes.error_message.email) {
      message = errorRes.error_message.email[0];
    }

    let errorResponse = {
      isError: true,
      errorMessage: message,
      isCooldownResend: error.response ? (error.response.status === 429 || error.response.data.code === 429) : false
    };

    return errorResponse;
  }
};

export const getNotification = async (accessToken, memberId, language, offset, limit) => {
  try {
    const config = {
      headers: {
        'x-api-key': baseUrlNotificationApiKey,
        'x-localization': language || 'id',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    };

    const body = {
      memberId,
      sortBy: 'created',
      orderBy: 'desc',
      limit,
      offset
    };

    const url = `${baseUrlNotification}v2/notifications/inbox`;
    const res = await AxiosAdapter.post(url, body, config);
    return res?.data?.data;
  } catch (error) {
    console.log('Notification.index@getNotification', error?.message);
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

    const url =
      baseUrlNotification + 'v2/notifications/inbox/' + notificationId;
    const result = await AxiosAdapter.get(url, config);
    const { data } = result.data;
    return data;
  } catch (error) {
    sentryCapture(`ActionGlobal@getNotificationDetail ${JSON.stringify(error)}`, 'Gagal mendapatkan notifikasi detail');

    console.log('Notification.index@getNotificationDetail' + error.message);
    return false;
  }
};

export const logout = async (accessToken, tokenId) => {

  try {
    const config = {
      headers: {
        'am-clientid': frOAUTHClientIDMobile,
        'Content-Type': 'application/json',
        'iPlanetDirectoryPro': tokenId,
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const url = `${frIGUrl}v1/sessions?_action=logout`;

    return await AxiosAdapter.post(url, null, config, 'forgerock:logout');
  } catch (error) {
    sentryCapture(`ActionGlobal@logout ${JSON.stringify(error)}`, 'Gagal logout');

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
      }
    };

    if (registerEmailNameData) {
      config.headers.email = registerEmailNameData.email;
    }

    const clientID = frOAUTHClientIDMobile;

    const url = `${frIGUrl}v1/oauth2/realms/tsel/access_token?grant_type=refresh_token&client_id=${clientID}&client_secret=${frOAUTHClientSecret}&refresh_token=${refreshToken}`;

    return await AxiosAdapter.post(url, null, config, 'forgerock:introspect-token');
  } catch (error) {
    sentryCapture(`ActionGlobal@refreshToken ${JSON.stringify(error)}`, 'Gagal menjalankan refresh token');

    const errorResponse = {
      isError: true
    };

    return errorResponse;
  }
};

export const postChangeMemberDeviceData = async (body) => {
  try {
    const { accessTokenData, modemData } = store.getState();

    const config = {
      headers: {
        'x-api-Key': baseUrlNewMemberApiKey,
        'x-localization': 'en',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessTokenData.accessToken
      }
    };

    const url = baseUrlMember + 'v2/members/device-router/' + modemData.id;
    let resultPut = await AxiosAdapter.put(url, body, config);

    const data = resultPut.data.data;
    const token = resultPut.data.token;
    const decryptData = JSON.parse(DecryptAES(data, token));

    resultPut.data.data = decryptData;

    return resultPut;
  } catch (error) {
    sentryCapture(`ActionGlobal@postChangeMemberDeviceData ${JSON.stringify(error)}`, 'Gagal ganti password');

    console.log('WifiChangeName&Password.index@postChangeMemberDeviceData', error.message);
    console.log('WifiChangeName&Password.index@postChangeMemberDeviceData', error);
    return false;
  }
};

export const postChangeGuestSsidAndPasswordMiddleware = async (ssid, password) => {
  try {
    const { accessTokenData, modemData } = store.getState();

    const config = {
      headers: {
        'x-api-Key': baseUrlNewMemberApiKey,
        'x-localization': 'en',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessTokenData.accessToken
      }
    };

    const body = {
      'guestSsid': ssid,
      'guestPassword': password
    };

    const url = baseUrlMember + 'v2/members/device-router/' + modemData.id;
    let resultPut = await AxiosAdapter.put(url, body, config);

    const data = resultPut.data.data;
    const token = resultPut.data.token;
    const decryptData = JSON.parse(DecryptAES(data, token));

    resultPut.data.data = decryptData;

    return resultPut;
  } catch (error) {
    console.log('WifiChangeName&Password.index@postChangeGuestSsidAndPasswordMiddleware', error.message);
    return false;
  }
};

export const getAppsLatestVersion = async () => {
  try {
    const url = baseUrl + 'latest-version.json';
    const result = AxiosAdapter.get(url);

    return await result;
  } catch (error) {
    sentryCapture(`ActionGlobal@getAppsLatestVersion ${JSON.stringify(error)}`, 'Gagal mendapatkan apps latest version');
    console.log('ActionGlobal@getAppsLatestVersion', error.message);
    return false;
  }
};

export const getModemDefaultData = async () => {
  try {
    const { accessTokenData, modemData } = store.getState();

    const body = {
      memberDeviceId: modemData.id
    };

    const config = {
      headers: {
        'x-api-Key': baseUrlMemberApiKey,
        'x-localization': 'en',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessTokenData.accessToken
      }
    };

    const url = baseUrlMember + 'v2/members/router/reset';
    let resultPut = await AxiosAdapter.post(url, body, config);

    const data = resultPut.data.data;
    const token = resultPut.data.token;
    const decryptData = JSON.parse(DecryptAES(data, token));

    resultPut.data.data = decryptData;

    return resultPut;
  } catch (error) {
    sentryCapture(`ActionGlobal@getModemDefaultData ${JSON.stringify(error)}`, 'Gagal mendapatkan modem default data');

    // console.log("ActionGlobal@getModemDefaultData", error);
    return false;
  }
};

export const postTicket = async (isInquiryForm, name, email, subject, description, category, subCategory, customerName, refundReason, modified, paymentMethod, attachmentToken) => {
  try {
    const body = {
      ticket: {
        requester: {
          name: name,
          email: email
        },
        ticket_form_id: isInquiryForm ? '360003061114' : '360003127494',
        subject: subject,
        comment: {
          body: description,
          uploads: attachmentToken
        },
        custom_fields: isInquiryForm ?
          [
            { id: 360036520633, value: category },
            { id: 360055643314, value: subCategory },
            { id: 360036659793, value: name },
            { id: 360036659813, value: email },
            { id: 360036659793, value: customerName }
            // { id: 360036722134, value: "085214356678" }
          ] :
          [
            { id: 360036659793, value: name },
            { id: 360036659813, value: email },
            { id: 360036659793, value: customerName },
            { id: 360036722154, value: refundReason },
            { id: 360037338493, value: modified },
            { id: 360036814773, value: paymentMethod }
            // { id: 360036722134, value: "085214356678" }
          ]
        ,
        collaborators: [{ name: name, email: email }]
      }
    };
    const url = baseUrlCoverageMs + 'zendesk/tickets';
    return await AxiosAdapter.post(url, body, mainConfig);
  } catch (error) {
    sentryCapture(`ActionGlobal@postTicket ${JSON.stringify(error)}`, 'Gagal post ticket zendesk');

    console.log('HelpEmailScreen.index@postTicket', error.message);
    return false;
  }
};

export const postPairingDate = async () => {
  const { language, accessTokenData, modemData } = store.getState();
  try {
    const { accessToken } = accessTokenData;
    const memberDeviceID = modemData.id;

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-Key': baseUrlNewMemberApiKey,
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
    let resultPut = await AxiosAdapter.put(url, body, config);

    const data = resultPut.data.data;
    const token = resultPut.data.token;
    const decryptData = JSON.parse(DecryptAES(data, token));

    resultPut.data.data = decryptData;

    return resultPut;
  } catch (error) {
    sentryCapture(`ActionGlobal@postPairingDate ${JSON.stringify(error)}`, 'Gagal post pairing date');

    console.log('PairingScreen.action@postPairingDate', error.message);
    return false;
  }
};

export const getTutorialFile = async (accessToken, language, channel) => {
  try {
    const config = {
      headers: {
        'x-localization': language ? language : 'id',
        'Content-Type': 'application/json',
        'x-api-Key': baseUrlContentApiKey,
        'channel': channel ? channel : 'web',
        'Authorization': `Bearer ${accessToken}`
      }
    };
    const url = baseUrlContentMs + 'v3/isetup/tutorial';
    return await AxiosAdapter.get(url, config);
  } catch (error) {
    return error.response;
  }
};

export const getValidatePrepaid = async (accessToken, language, msisdn) => {
  try {
    const config = {
      headers: {
        'x-localization': language,
        'Content-Type': 'application/json',
        'x-api-Key': baseUrlSubscriptionsApiKey,
        'channel': 'mobile',
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        msisdn
      }
    };
    const url = baseUrlSubscriptionsMs + 'v1/subscriptions/prepaid';
    return await AxiosAdapter.get(url, config);
  } catch (error) {
    return error;
  }
};

export const getModemFeature = async (accessToken, dataParams) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-Key': baseUrlDevicesApiKey,
        'channel': 'mobile',
        'Authorization': `Bearer ${accessToken}`
      }
    };
    let url = dataParams.firmwareVersion
      ? baseUrlDevices + `v1/devices/configuration/feature?deviceModel=${dataParams.deviceModel}&versionApp=${dataParams.versionApp}&versionFirmware=${dataParams.firmwareVersion}`
      : baseUrlDevices + `v1/devices/configuration/feature?deviceModel=${dataParams.deviceModel}&versionApp=${dataParams.versionApp}&versionFirmware=`;

    // const url = baseUrlDevices + `v1/devices/configuration/feature?deviceModel=HUAWEI-B311As-853&versionFirmware=HUAWEI_10.0.3.1&versionApp=v0.22.2`
    return await AxiosAdapter.get(url, config);
  } catch (error) {
    return error.response;
  }
};

export const getNetwokLogger = async () => {
  try {
    const { language } = store.getState();
    const result = await getContentGeneralMs('enable_logger_app', language);
    const allowedBaseUrl = [
      'https://dev.myorbit.id/',
      'https://preprod.myorbit.id/',
      'https://uat.myorbit.id/',
      'https://beta.myorbit.id/'
    ];
    const isEnableLogger = !!result?.data?.data && allowedBaseUrl.includes(baseUrl);

    if (isEnableLogger) {
      store.dispatch({
        type: SET_NETWORK_LOGGER,
        data: { active: true, isShow: false }
      });
    } else {
      store.dispatch({
        type: SET_NETWORK_LOGGER,
        data: { active: false, isShow: false }
      });
    }
  } catch (error) {
    console.log('actionGlobal@getNetwokLogger', error);
  }
};

/**
 *
 * @param language
 * @param monthFormat
 * @returns {string}
 */
export function currentDateTime(language = 'id', monthFormat = 'long') {
  const current = new Date();
  return `${current.getDate()} ${current.toLocaleString(language, { month: monthFormat })} ${current.getFullYear()}, ${current.getHours()}:${current.getMinutes()}`;
};

/**
 *
 * @param msisdn
 * @returns {*|boolean}
 */
export function formatMsisdn(msisdn = false) {
  if (msisdn) {
    return msisdn?.startsWith('62') ? msisdn?.replace(/^.{2}/g, '0') : msisdn;
  }
};

export const deleteAccount = async () => {
  try {
    const { accessTokenData } = store.getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-Key': baseUrlMemberApiKey,
        'x-localization': 'id',
        'x-client-version': versionApp,
        'x-client-name': 'account-deletion',
        'channel': 'apps',
        Authorization: `Bearer ${accessTokenData.accessToken}`
      }
    };

    const url = baseUrlMember + 'v1/members';
    return await AxiosAdapter.delete(url, config);
  } catch (error) {
    console.log('actionGlobal@deleteAccount', error);
    return false;
  }
};

/**
 *
 * @returns {Promise<string>}
 */
export function getIpAddress() {
  return deviceInfoModule.getIpAddress()
    .then((ipaddress) => ipaddress);
};
