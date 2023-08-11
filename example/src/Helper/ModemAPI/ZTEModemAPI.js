import CryptoJS from 'crypto-js';
import { RNFetchBlobAdapter } from '../../Config/RNFetchBlobAdapter';
import { store } from '../../Config/Store';

export const errorCodes = {};
let tokenCookie = '';

/* Currently modem with IDPRO version ZTE-MF293N & ZTE-MF283U */
const _checkIsModemIdpro = (packageType) => {
  let isIdpro = false;

  if (packageType.includes('ZTE-MF293N') || packageType.includes('ZTE-MF283U') ) {
    isIdpro = true;
  }

  return isIdpro;
};

/**
 * 
 * @param {string} modemIP 
 * @returns {object} return reusable headers for ZTE API
 * ZTE API need to post data using 'Content-Type': 'application/x-www-form-urlencoded'
 */
const getHeaders = (modemIP = '192.168.8.1') => {
  const { modemData } = store.getState();
  const modemType = modemData?.attributes?.packageType;

  if (modemType.includes('ZTE-MF293N')) {
    return {
      'Host': modemIP,
      'Origin': `https://${modemIP}`,
      'Referer': `https://${modemIP}/index.html`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': `stok=${tokenCookie}`
    };
  } else {
    return {
      'Host': modemIP,
      'Origin': `https://${modemIP}`,
      'Referer': `https://${modemIP}/index.html`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }
};

const getHeadersLogin = (modemIP = '192.168.8.1') => {
  return {
    'Host': modemIP,
    'Origin': `https://${modemIP}`,
    'Referer': `https://${modemIP}/index.html`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Set-Cookie': `stok=${getTokenRandom()}`
  };
};

const getTokenRandom = () => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 24; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  tokenCookie = result.toUpperCase();
  return result.toUpperCase();
};

/**
 * 
 * @param {string} password 
 * @returns {string} encoded string using Base64
 */
const encBase64 = (password) => {
  try {
    const encodedWord = CryptoJS.enc.Utf8.parse(password);
    const encoded = CryptoJS.enc.Base64.stringify(encodedWord);

    return encoded;
  } catch (error) {
    console.log('ZTEModemAPI_error@encBase64', error.response);
    return false;
  }
};

/**
 * 
 * @param {string} params 
 */
const requestFormUrlEncodeZTE = (params) => {
  try {
    let formBody = params.split(':').join('%3A');

    return formBody;
  } catch (error) {
    console.log('ZTEModemAPI_error@requestFormUrlEncodeZTE', error.response);
    return false;
  }
};

/**
 * 
 * @param {object} body 
 * @returns {string} for post data using 'Content-Type': 'application/x-www-form-urlencoded'
 * ZTE API need to post data using 'Content-Type': 'application/x-www-form-urlencoded', make sure use this function for submiting data 
 */
const requestFormUrlEncoded = (body) => {
  try {
    let formBody = [];
    for (let property in body) {
      formBody.push(property + '=' + body[property]);
    }

    return formBody.join('&');
  } catch (error) {
    console.log('ZTEModemAPI_error@requestFormUrlEncoded', error.response);
    return false;
  }
};

/**
 * Get Query Version Firmware
 * @param {String} modemIP 
 * @returns 
 */
export const _getQueryVersionOld = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;
      modemIP = modemIP ?? globalData.modemIP;

      const headers = getHeaders(modemIP);
      const url = `https://${modemIP}/goform/goform_get_cmd_process?multi_data=1&cmd=integrate_version`;

      if (_checkIsModemIdpro(packageType)) {
        const result = await RNFetchBlobAdapter.get(url, headers);
        // console.log('ZTEModemAPI@_getQueryVersionOld', JSON.parse(result?.data));
        const resultData = JSON.parse(result?.data);

        if (resultData?.integrate_version == 'TKM_SID_MF293NV1.0.0B04') {
          resolve(true);
        } else if (resultData?.integrate_version == 'PT_ID_MF283UV1.0.0B01') {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }

    } catch (error) {
      console.log('ZTEModemAPI_error@_getQueryVersionOld', error);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @param {string} username username for login default is 'admin'
 * @param {string} password password for login default is 'admin', but after unlocking modem it will change to passwordRouter on CMS MemberDevice
 * @returns {boolean} if logged in value will be true
 */
export const _checkLoginStatusZTE = (modemIP, username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
			const packageType = modemData.attributes.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      username = username ? username : globalData.modemUsername;
      password = password ? password : modemData.attributes.passwordRouter;

      let loginStatus = await _getModemLoginStatusZTE(modemIP);
      // console.log('loginStatus', loginStatus);

      if (loginStatus != '1') {
        let login;

          let isLoginNew = false;
          const packageTypeUpper = packageType.toUpperCase();

          if (packageTypeUpper.includes('ZTE-5G-MC801A') || packageTypeUpper.includes('ZTE-MF293N') || packageTypeUpper.includes('ZTE-MF283U')) {
            isLoginNew = true;
          }

        if (isLoginNew) {
          login = await _postModemLoginNewZTE(modemIP, packageType);
        } else {
          login = await _postModemLoginZTE(modemIP, username, password);
        }

        if (login.result != '0') {
          resolve(false);
          return;
        }
      }

      resolve(true);
    } catch (error) {
      console.log('ZTEModemAPI_error@_checkLoginStatusZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @returns {string} result from API
 * status logged in if {'privacy_read_flag': '1'}
 */
export const _getModemLoginStatusZTE = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData } = store.getState();
			const packageType = modemData?.attributes?.packageType;

      const headers = getHeaders(modemIP);
      let url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&cmd=privacy_read_flag&multi_data=1`;

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getModemLoginStatusZTE', result.data);

      const resultParse = JSON.parse(result.data);
      const modemType = modemData?.attributes?.model;
      const isIdpro = _checkIsModemIdpro(packageType);

      if (modemType.includes('ZTE-5G-MC801A') || (isIdpro)) {
        resolve(
          resultParse.privacy_read_flag === '0' || resultParse.privacy_read_flag === '1'
            ? '1'
            : '3'
        );
      } else {
        resolve(resultParse.privacy_read_flag === '1' ? resultParse.privacy_read_flag : '3');
      }
    } catch (error) {
      console.log('ZTEModemAPI_error.message@getModemLoginStatus', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @param {string} username username for login default is 'admin'
 * @param {string} password password for login default is 'admin', but after unlocking modem it will change to passwordRouter on CMS MemberDevice
 * @returns {object} result from API
 * result success will be like this {'result':'0'}
 * result value based on Documentation 0（success）/ 1(unknown error，fail) / 3（password is wrong）/ 5(With deviceUI：LCD is setting。
 */
export const _postModemLoginZTE = async (modemIP = '192.168.8.1', username = 'admin', password = 'admin') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      username = username ? username : globalData.modemUsername;
      password = password ? password : modemData.attributes.passwordRouter;

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);

      const body = {
        'isTest': false,
        'goformId': 'LOGIN',
        'password': encBase64(password)
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postModemLoginZTE', result.data);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@postModemLogin', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @param {string} username username for login default is 'admin'
 * @param {string} password password for login default is 'admin', but after unlocking modem it will change to passwordRouter on CMS MemberDevice
 * @returns {object} result from API
 * result success will be like this {'result':'0'}
 * result value based on Documentation 0（success）/ 1(unknown error，fail) / 3（password is wrong）/ 5(With deviceUI：LCD is setting。
 */
export const _postModemLoginNewZTE = async (modemIP = '192.168.8.1', packageType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = _checkIsModemIdpro(packageType) ? getHeadersLogin(modemIP) : getHeaders(modemIP);

      let password;

      if (packageType.includes('ZTE-5G-MC801A')) {
        password = 'F065F2AEC48B66B0F807BC31AF8BC579A995CE844551035E0EA0FA70109BCE93';
      } else if (packageType.includes('ZTE-MF293N') || packageType.includes('ZTE-MF283U')) {
        password = encBase64('vkL9oxO3ukNF');
      } else {
        password = encBase64('admin');
      }

      const body = {
        'isTest': false,
        'goformId': 'LOGIN_NEW',
        'password': password,
        'user': 'homelte6187'
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postModemLoginZTENew', result.data);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@postModemLoginZTENew', error.message);
      resolve(false);
    }
  });
};
/**
 * 
 * @param {string} modemIP protocol modem
 * @param {string} username username for login default is 'admin'
 * @param {string} password password for login default is 'admin', but after unlocking modem it will change to passwordRouter on CMS MemberDevice
 * @returns {object} result from API
 * result success will be like this {'result':'0'}
 * result value based on Documentation 0（success）/ 1(unknown error，fail) / 3（password is wrong）/ 5(With deviceUI：LCD is setting。
 */
export const _postModemLoginZTE5G = async (modemIP = '192.168.8.1', username = 'admin', password = 'admin') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      username = username || globalData.modemUsername;
      password = password || modemData.attributes.passwordRouter;

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);

      const body = {
        'isTest': false,
        'goformId': 'LOGIN_NEW',
        'password': 'dmtMOW94TzN1a05G',
        // 'password': 'F065F2AEC48B66B0F807BC31AF8BC579A995CE844551035E0EA0FA70109BCE93',
        'user': 'homelte6187'
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postModemLoginZTE5G', result.data);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@postModemLoginZTE5G', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @returns {object} result from api
 * if success response will {'result':'success'}, if response {'result':'failure'} maybe not login
 */
export const _postModemLogoutZTE = async (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `https://${modemIP}/xml_action.cgi?Action=logout`;
      const headers = getHeaders(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('NotionModemAPI@postModemLogout', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @param {string} user username for login default is 'admin'
 * @param {string} newPass password for setup into new password login, the value of new password is get from passwordRouter on CMS MemberDevice
 * @param {string} oldPass the default password for login into modem before it change to new password
 * @returns {object} result from API
 * result success will be like this {'result':'success'}
 */
export const _postChangeAdminPasswordZTE = async (modemIP = '192.168.8.1', username = 'admin', newPassword = 'admin', oldPassword = 'admin') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      if (!await _checkLoginStatusZTE(modemIP, username, oldPassword)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let goformId = 'CHANGE_PASSWORD';

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);
        goformId = queryVersionOld ? 'CHANGE_PASSWORD' : 'IDPRO_CHANGE_PASSWORD';
      }

      const body = {
        isTest: false,
        goformId: goformId,
        oldPassword: encBase64(oldPassword),
        newPassword: encBase64(newPassword)
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postChangeAdminPasswordZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_postChangeAdminPasswordZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @returns {boolean} result from API
 * status logged in if {'loginfo': 'ok'}
 */
export const _getHeartBeatZTE = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = getHeaders(modemIP);
      let url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&cmd=loginfo&multi_data=1`;

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getHeartBeatZTE', result.data);

      const resultParse = JSON.parse(result.data);

      resolve(resultParse.loginfo.toUpperCase() == 'OK' ? true : false);
    } catch (error) {
      // console.log('ZTEModemAPI_error@_getHeartBeatZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @returns {object} result router information from API
 */
export const _getDeviceInformationZTE = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData.modemUsername || 'admin';
      const password = ('attributes' in modemData) ? modemData.attributes.passwordRouter : 'admin';

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const headers = getHeaders(modemIP);
      let url = `https://${modemIP}/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=apn_interface_version,wifi_coverage,m_ssid_enable,imei,network_type,rssi,rscp,lte_rsrp,imsi,sim_imsi,cr_version,wa_version,hardware_version,web_version,wa_inner_version,MAX_Access_num,SSID1,AuthMode,WPAPSK1_encode,m_SSID,m_AuthMode,m_HideSSID,m_WPAPSK1_encode,m_MAX_Access_num,lan_ipaddr,mac_address,msisdn,LocalDomain,wan_ipaddr,static_wan_ipaddr,ipv6_wan_ipaddr,ipv6_pdp_type,ipv6_pdp_type_ui,pdp_type,pdp_type_ui,opms_wan_mode,opms_wan_auto_mode,ppp_status`;

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        if (!await _getQueryVersionOld(modemIP)) {
          url = `https://${modemIP}/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=idpro_apn_interface_version,wifi_coverage,m_ssid_enable,imei,network_type,rssi,rscp,lte_rsrp,imsi,sim_imsi,cr_version,wa_version,hardware_version,web_version,wa_inner_version,MAX_Access_num,SSID1,AuthMode,WPAPSK1_encode,m_SSID,m_AuthMode,m_HideSSID,m_WPAPSK1_encode,m_MAX_Access_num,lan_ipaddr,mac_address,msisdn,LocalDomain,wan_ipaddr,static_wan_ipaddr,ipv6_wan_ipaddr,ipv6_pdp_type,ipv6_pdp_type_ui,pdp_type,pdp_type_ui,opms_wan_mode,opms_wan_auto_mode,ppp_status`;
        }
      }

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getDeviceInformationZTE', JSON.parse(result.data));

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_getDeviceInformationZTE', error.message);
      // console.log('ZTEModemAPI_error@_getDeviceInformationZTE', error.response);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {*} modemIP protocol modem
 * @returns 
 */
export const _getGuestSSIDStatusZTE = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData.modemUsername || 'admin';
      const password = ('attributes' in modemData) ? modemData.attributes.passwordRouter : 'admin';
      const headers = getHeaders(modemIP);

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      let url = `https://${modemIP}/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=apn_interface_version,wifi_coverage,m_ssid_enable,imei,network_type,rssi,rscp,lte_rsrp,imsi,sim_imsi,cr_version,wa_version,hardware_version,web_version,wa_inner_version,MAX_Access_num,SSID1,AuthMode,WPAPSK1_encode,m_SSID,m_AuthMode,m_HideSSID,m_WPAPSK1_encode,m_MAX_Access_num,lan_ipaddr,mac_address,msisdn,LocalDomain,wan_ipaddr,static_wan_ipaddr,ipv6_wan_ipaddr,ipv6_pdp_type,ipv6_pdp_type_ui,pdp_type,pdp_type_ui,opms_wan_mode,opms_wan_auto_mode,ppp_status`;

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        if (!await _getQueryVersionOld(modemIP)) {
          url = `https://${modemIP}/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=idpro_apn_interface_version,wifi_coverage,m_ssid_enable,imei,network_type,rssi,rscp,lte_rsrp,imsi,sim_imsi,cr_version,wa_version,hardware_version,web_version,wa_inner_version,MAX_Access_num,SSID1,AuthMode,WPAPSK1_encode,m_SSID,m_AuthMode,m_HideSSID,m_WPAPSK1_encode,m_MAX_Access_num,lan_ipaddr,mac_address,msisdn,LocalDomain,wan_ipaddr,static_wan_ipaddr,ipv6_wan_ipaddr,ipv6_pdp_type,ipv6_pdp_type_ui,pdp_type,pdp_type_ui,opms_wan_mode,opms_wan_auto_mode,ppp_status`;
        }
      }

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getDeviceInformationZTE', JSON.parse(result.data));

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_getGuestSSIDStatusZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @param {string} password password SSID
 * @param {string} wifiSSID name SSID
 * @returns {object} response from API
 * if success response will {'result':'success'}, if response {'result':'failure'} maybe not login
 */
export const _postChangeSSIDPasswordZTE = (modemIP = '192.168.8.1', wifiPassword, wifiName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;
      const packageType = modemData?.attributes?.packageType;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let body = {};
      let goformId = 'SET_WIFI_SSID1_PARA_SETTINGS';
      const isIdpro = _checkIsModemIdpro(packageType);

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (isIdpro) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);
        goformId = queryVersionOld ? 'SET_WIFI_SSID1_PARA_SETTINGS' : 'IDPRO_SET_WIFI_SSID1_PARA_SETTINGS';
      }

      if (packageType.includes('ZTE-MF286R')) {
        body = {
          goformId: 'setAccessPointInfo',
          ChipIndex: 0,
          AccessPointIndex: 0,
          SSID: wifiName,
          Password: encBase64(wifiPassword),
          ApMaxStationNumber: 32
        };
      } else if (packageType.includes('ZTE-5G-MC801A')) {
        body = {
          isTest: false,
          goformId: 'setAccessPointInfo',
          ChipIndex: 0,
          AccessPointIndex: 0,
          SSID: wifiName,
          Password: encBase64(wifiPassword),
          AccessPointSwitchStatus: 1
        };
      } else if (isIdpro) {
        body = {
          isTest: false,
          goformId: goformId,
          ssid: wifiName,
          broadcastSsidEnabled: 0,
          MAX_Access_num: 32,
          security_mode: 'WPA2PSK',
          cipher: 1,
          NoForwarding: 0,
          qrcode_display_switch: 1,
          security_shared_mode: 1,
          passphrase: encBase64(wifiPassword)
        };
      } else {
        body = {
          isTest: false,
          goformId: 'SET_WIFI_SSID1_SETTINGS',
          ssid: wifiName,
          broadcastSsidEnabled: 0,
          MAX_Access_num: 32,
          security_mode: 'WPA2PSK',
          cipher: 1,
          NoForwarding: 0,
          security_shared_mode: 1,
          passphrase: encBase64(wifiPassword)
        };
      }

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postChangeSSIDPasswordZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_postChangeSSIDPasswordZTE', error.message);
      if (error.message == 'Not Login Into Modem...') {
        resolve(false);
      } else {
        resolve({ result: 'success' });
      }
    }
  });
};

/**
 * 
 * @param {string} modemIP modem protocol
 * @param {number} status status enable/disable guest ssid
 * @returns 
 */
export const _activateGuestSSIDZTE = (modemIP = '192.168.8.1', status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;
      const packageType = modemData?.attributes?.packageType;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let goformId = 'SET_WIFI_INFO';

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);
        goformId = queryVersionOld ? 'SET_WIFI_INFO' : 'IDPRO_SET_WIFI_INFO';
      }

      const body = {
        isTest: false,
        goformId: goformId,
        m_ssid_enable: status,
        wifiEnabled: 1
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_activateGuestSSIDZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_activateGuestSSIDZTE', error.message);

      /**
       * Get device info with interval because modem will restart and response will Network Error.
       */
      const myInterval = setInterval(async () => {
        const getDevice = await _getDeviceInformationZTE(modemIP);
        if (getDevice) {
          clearInterval(myInterval);
          resolve(getDevice);
        }
      }, 5000);
    }
  });
};

/**
 * 
 * @param {string} modemIP modem protocol
 * @param {string} wifiName wifi ssid name
 * @param {string} wifiPassword wifi ssid password
 * @returns 
 */
export const _postChangeSSIDPasswordGuestZTE = (modemIP = '192.168.8.1', wifiName, wifiPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;
      const packageType = modemData?.attributes?.packageType;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let goformId = 'SET_WIFI_SSID2_PARA_SETTINGS';

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);
        goformId = queryVersionOld ? 'SET_WIFI_SSID2_PARA_SETTINGS' : 'IDPRO_SET_WIFI_SSID2_PARA_SETTINGS';
      }

      const body = {
        isTest: false,
        goformId: goformId,
        m_SSID: wifiName,
        m_HideSSID: 0,
        m_MAX_Access_num: 16,
        m_AuthMode: 'WPA2PSK',
        cipher: 1,
        m_NoForwarding: 0,
        m_EncrypType: 1,
        m_WPAPSK1: encBase64(wifiPassword)
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postChangeSSIDPasswordGuestZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_postChangeSSIDPasswordGuestZTE', error.message);
      // resolve(false);
      const myInterval = setInterval(async () => {
        const getDevice = await _getDeviceInformationZTE(modemIP);
        if (getDevice) {
          clearInterval(myInterval);
          resolve(getDevice);
        }
      }, 5000);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @param {string} username username for login default is 'admin'
 * @param {string} password password for login default is 'admin', but after unlocking modem it will change to passwordRouter on CMS MemberDevice
 * @returns {Array} List of connected device
 */
export const _getModemListConnectedZTE = (modemIP = '192.168.8.1', username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      username = username ? username : globalData.modemUsername;
      password = password ? password : modemData.attributes.passwordRouter;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      let url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&cmd=station_list`;

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        if (!await _getQueryVersionOld(modemIP)) {
          url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&cmd=idpro_station_list`;
        }
      }

      const headers = getHeaders(modemIP);
      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getModemListConnectedZTE', result);

      const resultData = JSON.parse(result?.data);
      resolve(resultData?.station_list);
    } catch (error) {
      console.log('ZTEModemAPI_error@_getModemListConnectedZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @returns {string} return ssid name
 */
export const _getModemSsidNameZTE = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const deviceInfo = await _getDeviceInformationZTE(modemIP);

      if (deviceInfo) {
        resolve(deviceInfo?.SSID1);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log('ZTEModemAPI_error@_getModemSsidNameZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Block Device
 * @param {String} modemIP 
 * @param {String} user 
 * @param {String} pass 
 * @param {Array} listDevice 
 * @returns 
 */
export const _postBlockDeviceZTE = (modemIP = '192.168.8.1', user, pass, listDevice) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;
      // const modemType = modemData?.attributes?.packageType;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let body = {};
      let goformId = 'WIFI_MAC_FILTER';

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);
        goformId = queryVersionOld ? 'WIFI_MAC_FILTER' : 'IDPRO_WIFI_MAC_FILTER';
      }

      listDevice.map((val, key) => {
        if (val.isBlocked !== null) {
          if (val.isBlocked) {
            body = {
              goformId: goformId,
              isTest: false,
              ACL_mode: 2,
              macFilteringMode: 2,
              wifi_hostname_black_list: '',
              wifi_mac_black_list: val.MACAddress
            };
          } else {
            body = {
              goformId: goformId,
              isTest: false,
              ACL_mode: 2,
              macFilteringMode: 2,
              wifi_hostname_black_list: '',
              wifi_mac_black_list: ''
            };
          }
        }
      });

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postBlockDeviceZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_postBlockDeviceZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Add Url Filter
 * @param {String} modemIP 
 * @param {*} dataUrl 
 * @returns 
 */
export const _postUrlFilteringZTE = async (modemIP = '192.168.8.1', dataUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let goformId = 'URL_FILTER_ADD';

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);
        goformId = queryVersionOld ? 'URL_FILTER_ADD' : 'IDPRO_URL_FILTER_ADD';
      }

      const body = {
        isTest: false,
        goformId: goformId,
        addURLFilter: dataUrl
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postUrlFilteringZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_postUrlFilteringZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Disable / Enable Url Filter
 * @param {String} modemIP 
 * @param {Boolean} status 
 * @returns 
 */
export const _postDisableUrlFilteringZTE = async (modemIP = '192.168.8.1', status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let goformId = 'URL_FILTER_FLAG';

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);
        goformId = queryVersionOld ? 'URL_FILTER_FLAG' : 'IDPRO_URL_FILTER_FLAG';
      }

      const body = {
        isTest: false,
        goformId: goformId,
        url_filter_mode: status
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postDisableUrlFilteringZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_postDisableUrlFilteringZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Delete Url Filter
 * @param {String} modemIP 
 * @param {String} dataIndex 
 * @returns 
 */
export const _postDeleteUrlFilteringZTE = async (modemIP = '192.168.8.1', dataIndex) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let goformId = 'URL_FILTER_DELETE';

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);
        goformId = queryVersionOld ? 'URL_FILTER_DELETE' : 'IDPRO_URL_FILTER_DELETE';
      }

      const body = {
        isTest: false,
        goformId: goformId,
        url_filter_delete_id: `${dataIndex};`
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postDeleteUrlFilteringZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_postDeleteUrlFilteringZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * Get Url Filter List
 * @param {String} modemIP 
 * @returns 
 */
export const _getUrlFilterList = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      const headers = getHeaders(modemIP);
      let url = `https://${modemIP}/goform/goform_get_cmd_process?cmd=websURLFilters&isTest=false`;

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        if (!await _getQueryVersionOld(modemIP)) {
          url = `https://${modemIP}/goform/goform_get_cmd_process?cmd=idpro_websURLFilters&isTest=false`;
        }
      }

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getUrlFilterList', result.data);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error.message@_getUrlFilterList', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Time Limit (Menyimpan Jadwal / Rule Parental)
 * @param {String} modemIP 
 * @param {*} time_limited 
 * @param {*} isDelete 
 * @returns 
 */
export const _postTimeLimitZTE = (modemIP = '192.168.8.1', time_limited, isDelete = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let goformId = 'SAVE_TIME_LIMITED';

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);
        goformId = queryVersionOld ? 'SAVE_TIME_LIMITED' : 'IDPRO_SAVE_TIME_LIMITED';
      }

      const body = {
        isTest: false,
        goformId: goformId,
        time_limited: isDelete ? '' : time_limited
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postTimeLimitZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_postTimeLimitZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Add Device to Rule Parental (Menambahkan perangkat pada jadwal / Rule Parental)
 * @param {String} modemIP 
 * @param {String} macAddress 
 * @param {Boolean} parentalStatus 
 * @returns 
 */
export const _postAddDeviceToParental = (modemIP = '192.168.8.1', macAddress, parentalStatus) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_set_cmd_process`;
      const headers = getHeaders(modemIP);
      let goformIdAdd = 'ADD_DEVICE';
      let goformIdDelete = 'DEL_DEVICE';

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        const queryVersionOld = await _getQueryVersionOld(modemIP);

        goformIdAdd = queryVersionOld ? 'ADD_DEVICE' : 'IDPRO_ADD_DEVICE';
        goformIdDelete = queryVersionOld ? 'DEL_DEVICE' : 'IDPRO_DEL_DEVICE';
      }

      const body = {
        isTest: false,
        goformId: parentalStatus ? goformIdAdd : goformIdDelete,
        mac: requestFormUrlEncodeZTE(macAddress)
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('ZTEModemAPI@_postAddDeviceToParental', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_postAddDeviceToParental', error.message);
      resolve(false);
    }
  });
};

/**
 * Get Device List Blocked (List perangkat yang di block)
 * @param {String} modemIP 
 * @returns 
 */
export const _getModemListBlockedZTE = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = getHeaders(modemIP);
      let url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&multi_data=1&cmd=ACL_mode%2Cwifi_mac_black_list%2Cwifi_hostname_black_list%2CRadioOff%2Cuser_ip_addr`;
      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getModemListBlockedZTE', result.data);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error.message@_getModemListBlockedZTE', error.message);
      resolve(false);
    }
  });
};

/**
 * Get User Parental (User / Device yang ditambahkan pada Rule Parental)
 * @param {String} modemIP 
 * @returns 
 */
export const _getUserParental = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData } = store.getState();
      const packageType = modemData?.attributes?.packageType;

      const headers = getHeaders(modemIP);
      let url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&cmd=childGroupList`;

      /**
       * Checking Firmware Validation for API with IDPRO version
       */
      if (_checkIsModemIdpro(packageType)) {
        if (!await _getQueryVersionOld(modemIP)) {
          url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&cmd=idpro_childGroupList`;
        }
      }

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getUserParental', result.data);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error.message@_getUserParental', error.message);
      resolve(false);
    }
  });
};

/**
 * Get Device it Self (Perangkat yang menginstall aplikasi / login pada WEBUI)
 * @param {String} modemIP 
 * @returns 
 */
export const _getDeviceItSelf = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = getHeaders(modemIP);
      let url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&cmd=get_user_mac_addr`;

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getDeviceItSelf', result.data);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error.message@_getUserParental', error.message);
      resolve(false);
    }
  });
};

/**
 * Get Time Rule
 * @param {String} modemIP 
 * @returns 
 */
export const _getTimeRule = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = getHeaders(modemIP);
      let url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&cmd=time_limited`;

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getTimeRule', result.data);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error.message@_getTimeRule', error.message);
      resolve(false);
    }
  });
};

/**
 * Get Url Filter List
 * @param {*} modemIP 
 * @returns 
 */
export const _getUrlFilterListZTE = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      let username = globalData.modemUsername;
      let password = modemData.attributes.passwordRouter;

      if (!await _checkLoginStatusZTE(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/goform/goform_get_cmd_process?isTest=false&cmd=websURLFilters`;
      const headers = getHeaders(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('ZTEModemAPI@_getUrlFilterLisZTE', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('ZTEModemAPI_error@_getUrlFilterListZTE', error.message);
      resolve(false);
    }
  });
};
