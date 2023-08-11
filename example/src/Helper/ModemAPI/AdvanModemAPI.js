import CryptoJS from 'crypto-js';
import { RNFetchBlobAdapter } from '../../Config/RNFetchBlobAdapter';
import { SET_COOKIE_HEADERS_ADVAN } from '../../Config/Reducer';
import { store } from '../../Config/Store';

/**
 * 
 * @param {string} modemIP 
 * @returns {object} return reusable headers for ADVAN API
 * ADVAN need to post data using 'Content-Type': 'application/x-www-form-urlencoded'
 */
const getHeaders = (modemIP = '192.168.8.1') => {
  const { cookieAndTokenAdvan } = store.getState();

  return {
    'Host': modemIP,
    'Origin': `https://${modemIP}`,
    'Referer': `https://${modemIP}/index.html`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': `cookie=${cookieAndTokenAdvan.cookie}`
  };
};

const getHeadersLogin = (modemIP = '192.168.8.1') => {
  return {
    'Host': modemIP,
    'Origin': `https://${modemIP}`,
    'Referer': `https://${modemIP}/index.html`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
};

/**
 * 
 * @param {object} body 
 * @returns {string} for post data using 'Content-Type': 'application/x-www-form-urlencoded'
 * ADVAN API need to post data using 'Content-Type': 'application/x-www-form-urlencoded', make sure use this function for submiting data 
 */
const requestFormUrlEncoded = (body) => {
  try {
    const formBody = [];
    for (const property in body) {
      formBody.push(`${property}=${body[property]}`);
    }

    return formBody.join('&');
  } catch (error) {
    console.log('AdvanModemAPI_error@requestFormUrlEncoded', error.response);
    return false;
  }
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
    console.log('AdvanModemAPI_error@encBase64', error.response);
    return false;
  }
};

/**
 * 
 * Encoding password to MD5 ==> to Base64
 * @param {string} modemIP 
 * @returns 
 */
const encMD5 = (password) => {
  try {
    const encyptMD5 = CryptoJS.MD5(password).toString();
    const encMD5toEncBase64 = encBase64(encyptMD5);

    return encMD5toEncBase64;
  } catch (error) {
    console.log('AdvanModemAPI_error@encMD5', error.response);
    return false;
  }
};

export const _getHeartBeatAdvan = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&multi_data=1&cmd=blc_wan_mode%2Cblc_wan_auto_mode%2Cloginfo%2Cppp_status%2Crj45_state%2Cethwan_mode&_=1624333859002`;
      const headers = getHeaders(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('AdvanModemAPI@_getHeartBeatAdvan', result.data);

      const resultParse = JSON.parse(result.data);

      // console.log("log info", resultParse.loginfo);

      resolve(resultParse.loginfo.toUpperCase() == 'OK' ? true : false);
    } catch (error) {
      console.log('AdvanModemAPI_error@_getHeartBeatAdvan', error.message);
      resolve(false);
    }
  });
};

export const setToken = async (modemIP = '192.168.8.1', username = 'admin', password = 'admin') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      username = username || globalData.modemUsername;
      password = password || modemData.attributes.passwordRouter;

      const randomToken = Math.floor(Math.random() * 9000000) + 1000000;
      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&cmd=set_token&_=1631236386123&token=${randomToken}`;
      const headers = getHeaders(modemIP);
      const result = await RNFetchBlobAdapter.get(url, headers);

      if (result.data) {
        await getToken();
        resolve(true);
      }
    } catch (error) {
      console.log('AdvanModemAPI_error@setToken', error.message);
      resolve(false);
    }
  });
};

export const getToken = async (modemIP = '192.168.8.1', username = 'admin', password = 'admin') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      username = username || globalData.modemUsername;
      password = password || modemData.attributes.passwordRouter;

      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&cmd=get_token&_=1624608937320`;
      const headers = getHeaders(modemIP);
      const result = await RNFetchBlobAdapter.get(url, headers);

      const data = JSON.parse(result.data);
      store.dispatch({
        type: SET_COOKIE_HEADERS_ADVAN,
        data: {
          token: data.token
        }
      });

      resolve(true);
    } catch (error) {
      console.log('AdvanModemAPI_error@getToken', error.message);
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
export const _postModemLoginAdvan = async (modemIP = '192.168.8.1', username = 'admin', password = 'admin') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      username = username || globalData.modemUsername;
      password = password || modemData.attributes.passwordRouter;

      const url = `https://${modemIP}/reqproc/proc_post`;
      // const headers = getHeaders(modemIP);
      const headers = getHeadersLogin(modemIP);

      const body = {
        'isTest': false,
        'goformId': 'LOGIN',
        'username': encBase64(username),
        'password': encMD5(password)
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_postModemLoginAdvan', result.data);

      const data = JSON.parse(result.data);
      store.dispatch({
        type: SET_COOKIE_HEADERS_ADVAN,
        data: {
          cookie: data.cookie
        }
      });

      await setToken();

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@postModemLogin', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @returns {string} result from API
 */
export const _getModemLoginStatusAdvan = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&multi_data=1&cmd=blc_wan_mode%2Cblc_wan_auto_mode%2Cloginfo%2Cppp_status%2Crj45_state%2Cethwan_mode&_=1624333859002`;
      const headers = getHeaders(modemIP);
      // const headers = getHeadersLogin(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('AdvanModemAPI@_getModemLoginStatusAdvan', result);

      const resultParse = JSON.parse(result.data);

      resolve(resultParse.loginfo.toUpperCase() == 'OK' ? '1' : '3');
    } catch (error) {
      console.log('AdvanModemAPI_error.message@getModemLoginStatus', error.message);
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
export const _checkLoginStatusAdvan = (modemIP, username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      username = username || globalData.modemUsername;
      password = password || modemData.attributes.passwordRouter;

      const loginStatus = await _getModemLoginStatusAdvan(modemIP);
      // console.log('loginStatus', loginStatus);

      if (loginStatus != '1') {
        const login = await _postModemLoginAdvan(modemIP, username, password);
        // console.log('loginResult@_postLoginAdminPasswordAdvan', login);

        if (login.result != '0') {
          resolve(false);
          return;
        }
      }

      resolve(true);
    } catch (error) {
      console.log('AdvanModemAPI_error@_checkLoginStatusAdvan', error.message);
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
export const _postChangeAdminPasswordAdvan = async (modemIP = '192.168.8.1', username = 'admin', newPassword = 'admin', oldPassword = 'admin') => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!await _checkLoginStatusAdvan(modemIP, username, oldPassword)) {
        throw new Error('Failed Login Into Modem...');
      }

      const { cookieAndTokenAdvan } = store.getState();
      const url = `https://${modemIP}/reqproc/proc_post`;
      const headers = getHeaders(modemIP);

      const body = {
        isTest: false,
        goformId: 'CHANGE_PASSWORD',
        newUsername: encBase64(username),
        oldPassword: encMD5(oldPassword),
        newPassword: encMD5(newPassword),
        CSRFToken: cookieAndTokenAdvan.token
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_postChangeAdminPasswordAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_postChangeAdminPasswordAdvan', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @returns {object} result router information from API
 */
export const _getDeviceInformationAdvan = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData.modemUsername || 'admin';
      const password = ('attributes' in modemData) ? modemData.attributes.passwordRouter : 'admin';

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&cmd=wifi_coverage%2Cm_ssid_enable%2Cimei%2Cnetwork_type%2Crssi%2Crscp%2Clte_rsrp%2Cimsi%2Csim_imsi%2Ccr_version%2Chardware_version%2CMAX_Access_num%2CSSID1%2CAuthMode%2CWPAPSK1_encode%2Cm_SSID%2Cm_AuthMode%2Cm_HideSSID%2Cm_WPAPSK1_encode%2Cm_MAX_Access_num%2Clan_ipaddr%2Ctz_voip_ver%2Cmac_address%2Cmsisdn%2CLocalDomain%2Cwan_ipaddr%2Cstatic_wan_ipaddr%2Cipv6_wan_ipaddr%2Cipv6_pdp_type%2Cpdp_type%2Cppp_status%2Csta_ip_status%2Crj45_state%2Cethwan_mode%2Cwan3_ip%2Cwan3_ipv6_ip%2Cwan4_ip%2Cwan4_ipv6_ip%2Cwifi_11n_cap&multi_data=1&_=1624332535791`;
      const headers = getHeaders(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('AdvanModemAPI@_getDeviceInformationAdvan', JSON.parse(result.data));

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_getDeviceInformationAdvan', error.response);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP protocol modem
 * @param {string} username username for login default is 'admin'
 * @param {string} password password for login default is 'admin', but after unlocking modem it will change to passwordRouter on CMS MemberDevice
 * @returns {object} for now it will return object but after development maybe will change into array if needed
 */
export const _getModemListConnectedAdvan = (modemIP = '192.168.8.1', username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      username = username || globalData.modemUsername;
      password = password || modemData.attributes.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&cmd=station_list&_=1624324350585`;
      const headers = getHeaders(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('AdvanModemAPI@_getModemListConnectedAdvan', result);

      const resultData = JSON.parse(result?.data);
      resolve(resultData?.station_list);
    } catch (error) {
      console.log('AdvanModemAPI_error@_getModemListConnectedAdvan', error.message);
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
export const _postChangeSSIDPasswordAdvan = (modemIP = '192.168.8.1', wifiPassword, wifiName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData, cookieAndTokenAdvan } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_post`;
      const headers = getHeaders(modemIP);
      let body = {};

      body = {
        isTest: false,
        goformId: 'SET_WIFI_SSID1_SETTINGS',
        ssid: encBase64(wifiName),
        broadcastSsidEnabled: '0',
        MAX_Access_num: '32',
        security_mode: 'WPA2PSK',
        cipher: '1',
        NoForwarding: '0',
        show_qrcode_flag: '0',
        wep_default_key: '0',
        wep_key_1: '12345',
        wep_key_2: '',
        wep_key_3: '',
        wep_key_4: '',
        WEP1Select: '1',
        security_shared_mode: '1',
        passphrase: encBase64(wifiPassword),
        CSRFToken: cookieAndTokenAdvan.token
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_postChangeSSIDPasswordAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_postChangeSSIDPasswordAdvan', error.message);
      if (error.message == 'Not Login Into Modem...') {
        resolve(false);
      } else {
        resolve({ result: 'success' });
      }
    }
  });
};

/**
 * Get Status Guest SSID Modem
 * @param {string} modemIP 
 * @param {string} deviceType 
 * @returns 
 */
export const _getGuestSSIDStatusAdvan = (modemIP = '192.168.8.1', deviceType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      let username = globalData.modemUsername;
      let password = modemData.attributes.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&cmd=wifi_cur_state%2CwifiEnabled%2Ctz_ssid2_enable%2Ctz_ssid3_enable%2Ctz_ssid4_enable%2CNoForwarding%2Cm_NoForwarding%2CWPAPSK1_encode%2Cm_WPAPSK1_encode%2CWPAPSK2_encode%2Cm_WPAPSK1_encode%2CWPAPSK3_encode%2Cm_WPAPSK1_encode%2CWPAPSK4_encode%2Cm_WPAPSK1_encode%2CMAX_Station_num%2CSSID1_decode%2CAuthMode%2CHideSSID%2CMAX_Access_num%2CEncrypType%2CKey1Str1%2CKey2Str1%2CKey3Str1%2CKey4Str1%2CDefaultKeyID%2Cm_SSID_decode%2Cm_AuthMode%2Cm_HideSSID%2Cm_MAX_Access_num%2Cm_EncrypType%2Cm_show_qrcode_flag%2Cm_DefaultKeyID%2Cm_Key1Str1%2Cm_Key2Str1%2Cm_Key3Str1%2Cm_Key4Str1%2CrotationFlag%2Cwifi_sta_connection%2CSSID2_decode%2CHideSSID2%2CAuthMode2%2CMAX_Access_num2%2CEncrypType2%2CSSID3_decode%2CHideSSID3%2CAuthMode3%2CMAX_Access_num3%2CEncrypType3%2CSSID4_decode%2CHideSSID4%2CAuthMode4%2CMAX_Access_num4%2CEncrypType4%2CS2_Key1Str1%2CS2_Key2Str1%2CS2_Key3Str1%2CS2_Key4Str1%2CS2_Key1Type%2CS2_Key2Type%2CS2_Key2Type%2CS2_Key4Type%2CS2_DefaultKeyID%2CS3_Key1Str1%2CS3_Key2Str1%2CS3_Key3Str1%2CS3_Key4Str1%2CS3_Key1Type%2CS3_Key2Type%2CS3_Key2Type%2CS3_Key4Type%2CS3_DefaultKeyID%2CS4_Key1Str1%2CS4_Key2Str1%2CS4_Key3Str1%2CS4_Key4Str1%2CS4_Key1Type%2CS4_Key2Type%2CS4_Key2Type%2CS4_Key4Type%2CS4_DefaultKeyID%2CMAX_Station_num2%2CMAX_Station_num3%2CMAX_Station_num4&multi_data=1&_=1657155535398`;
      const headers = getHeaders(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('AdvanModemAPI@_getGuestSSIDStatusAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_getGuestSSIDStatusAdvan', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Change Guest SSID Name & Password
 * @param {string} modemIP 
 * @param {string} wifiName 
 * @param {string} password 
 * @param {string} deviceType 
 * @returns 
 */
export const _postChangeSSIDPasswordGuestAdvan = (modemIP = '192.168.8.1', wifiName, wifiPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData, cookieAndTokenAdvan } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_post`;
      const headers = getHeaders(modemIP);
      let body = {};

      body = {
        isTest: false,
        goformId: 'SET_WIFI_SSID4_SETTINGS',
        ssid: encBase64(wifiName),
        broadcastSsidEnabled: '0',
        MAX_Access_num: '32',
        security_mode: 'WPA2PSK',
        cipher: '1',
        NoForwarding: '0',
        show_qrcode_flag: '0',
        wep_default_key: '0',
        wep_key_1: '12345',
        wep_key_2: '',
        wep_key_3: '',
        wep_key_4: '',
        WEP1Select: '1',
        security_shared_mode: '1',
        passphrase: encBase64(wifiPassword),
        CSRFToken: cookieAndTokenAdvan.token
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_postChangeSSIDPasswordGuestAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_postChangeSSIDPasswordGuestAdvan', error.message);
      if (error.message == 'Not Login Into Modem...') {
        resolve(false);
      } else {
        resolve({ result: 'success' });
      }
    }
  });
};


/**
 * Disable/Enable Guest SSID Modem
 * @param {string} modemIP 
 * @param {boolean} status 
 * @param {string} guestSsidData 
 * @returns 
 */
export const _activateGuestSSIDAdvan = (modemIP = '192.168.8.1', status, guestSsidData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData, cookieAndTokenAdvan } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_post`;
      const headers = getHeaders(modemIP);
      let body = {};

      body = {
        goformId: 'SET_WIFI_INFO2',
        isTest: false,
        wifiEnabled: status,
        wifiOrder: 1,
        CSRFToken: cookieAndTokenAdvan.token
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_activateGuestSSIDAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_activateGuestSSIDAdvan', error.message);
      if (error.message == 'Not Login Into Modem...') {
        resolve(false);
      }
    }
  });
};

/**
 * Get Url filter list
 * @param {string} modemIP 
 * @returns 
 */
export const _getUrlFilterListAdvan = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      let username = globalData.modemUsername;
      let password = modemData.attributes.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&cmd=websURLFilters&_=162432738742`;
      const headers = getHeaders(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('AdvanModemAPI@_getUrlFilterListAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_getUrlFilterListAdvan', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Url Filtering
 * @param {string} modemIP 
 * @param {object} dataUrl 
 * @returns 
 */
export const _postUrlFilteringAdvan = (modemIP = '192.168.8.1', dataUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData, cookieAndTokenAdvan } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_post`;
      const headers = getHeaders(modemIP);
      let body = {};

      body = {
        goformId: 'URL_FILTER_ADD',
        isTest: false,
        addURLFilter: dataUrl,
        CSRFToken: cookieAndTokenAdvan.token
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_postUrlFilteringAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_postUrlFilteringAdvan', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Delete Url Filtering
 * @param {string} modemIP 
 * @param {array} filteringArray 
 * @returns 
 */
export const _postDeleteUrlFilteringAdvan = (modemIP = '192.168.8.1', dataIndex) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData, cookieAndTokenAdvan } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_post`;
      const headers = getHeaders(modemIP);
      let body = {};

      body = {
        goformId: 'URL_FILTER_DELETE',
        isTest: false,
        url_filter_delete_id: `${dataIndex};`,
        CSRFToken: cookieAndTokenAdvan.token
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_postDeleteUrlFilteringAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_postDeleteUrlFilteringAdvan', error.message);
      resolve(false);
    }
  });
};


/**
 * Handle Enable/Disable Url Filtering
 * @param {string} modemIP 
 * @param {boolean} status 
 * @returns 
 */
export const _postDisableUrlFilteringAdvan = (modemIP = '192.168.8.1', status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData, cookieAndTokenAdvan } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_post`;
      const headers = getHeaders(modemIP);
      let body = {};

      body = {
        goformId: 'URL_FILTER_SWITCH',
        isTest: false,
        url_filter_enable: status,
        CSRFToken: cookieAndTokenAdvan.token
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_postDisableUrlFilteringAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_postDisableUrlFilteringAdvan', error.message);
      resolve(false);
    }
  });
};


/**
 * Post Block Devices
 * @param {String} modemIP 
 * @param {String} user 
 * @param {String} pass 
 * @param {Array} listDevice 
 * @returns 
 */
export const _postBlockDeviceAdvan = (modemIP = '192.168.8.1', user, pass, listDevice) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData, cookieAndTokenAdvan } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_post`;
      const headers = getHeaders(modemIP);

      let deviceListBlocked = ''

      listDevice.map((val, key) => {
        if (val.isBlocked !== null) {
          if (val.isBlocked) {
            deviceListBlocked += `${val.MACAddress};`
          } 
        }
      });

      let body = {
        goformId: 'WIFI_MAC_FILTER',
        isTest: false,
        ACL_mode: 2,
        macFilteringMode: 2,
        wifi_hostname_black_list: '',
        wifi_mac_black_list: deviceListBlocked,
        CSRFToken: cookieAndTokenAdvan.token
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_postBlockDeviceAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_postBlockDeviceAdvan', error.message);
      resolve(false);
    }
  });
};


/**
 * Get List Blocked Devices
 * @param {String} modemIP 
 * @returns 
 */
export const _getModemListBlockedAdvan = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      let username = globalData.modemUsername;
      let password = modemData.attributes.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&multi_data=1&cmd=ACL_mode%2Cwifi_mac_black_list%2Cwifi_hostname_black_list%2CRadioOff%2Cuser_ip_addr`;
      const headers = getHeaders(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('AdvanModemAPI@_getModemListBlockedAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_getModemListBlockedAdvan', error.message);
      resolve(false);
    }
  });
};

/**
 * Post Set Time Limit
 * @param {String} modemIP 
 * @param {String} endTime 
 * @param {String} devicesName 
 * @param {String} startTime 
 * @param {String} weekEnable 
 * @param {String} devicesMac 
 * @returns 
 */
export const _postTimeLimitAdvan = (modemIP = '192.168.8.1', endTime, devicesName, startTime, weekEnable, devicesMac) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData, cookieAndTokenAdvan, deviceListParental } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_post`;
      const headers = getHeaders(modemIP);
      let body = {
        'isTest': false,
        'goformId': 'GLOBE_SET_PARENTAL_CONTROL',
        'CSRFToken': cookieAndTokenAdvan.token,
        'parentList': deviceListParental
      };

      const result = await RNFetchBlobAdapter.post(url, headers, JSON.stringify(body));
      // console.log('AdvanModemAPI@_postTimeRuleAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_postTimeRuleAdvan', error.message);
      resolve(false);
    }
  });
};

/**
 * Get Parental Control List
 * @param {String} modemIP 
 * @returns 
 */
export const _getTimeRuleAdvan = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData, cookieAndTokenAdvan } = store.getState();

      modemIP = modemIP || globalData.modemIP;
      const username = globalData?.modemUsername;
      const password = modemData?.attributes?.passwordRouter;

      if (!await _checkLoginStatusAdvan(modemIP, username, password)) {
        throw new Error('Failed Login Into Modem...');
      }

      const url = `https://${modemIP}/reqproc/proc_get`;
      const headers = getHeaders(modemIP);
      let body = {
        'isTest': false,
        'cmd': 'GLOBE_GET_PARENTAL_CONTROL',
        'CSRFToken': cookieAndTokenAdvan.token
      };

      const result = await RNFetchBlobAdapter.post(url, headers, requestFormUrlEncoded(body));
      // console.log('AdvanModemAPI@_getTimeRuleAdvan', result);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error@_getTimeRuleAdvan', error.message);
      resolve(false);
    }
  });
};

export const _getDeviceItSelfAdvan = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `https://${modemIP}/reqproc/proc_get?isTest=false&multi_data=1&cmd=ACL_mode%2Cwifi_mac_black_list%2Cwifi_hostname_black_list%2Cwifi_cur_state%2Cuser_ip_addr%2Cclient_mac_address%2Cwifi_mac_white_list&_`;
      const headers = getHeaders(modemIP);

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('AdvanModemAPI@_getDeviceItSelf', result.data);

      resolve(JSON.parse(result.data));
    } catch (error) {
      console.log('AdvanModemAPI_error.message@_getDeviceItSelf', error.message);
      resolve(false);
    }
  });
};
