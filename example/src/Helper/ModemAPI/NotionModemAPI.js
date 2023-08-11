// import '../../../shim';
import { Platform } from 'react-native';
import { MD5 } from 'crypto-js';
import CookieManager from '@react-native-cookies/cookies';
import xml2js, { parseString } from 'react-native-xml2js';

import { RNFetchBlobAdapter } from '../../Config/RNFetchBlobAdapter';
import { store } from '../../Config/Store';
import { lowercaseObjectKeys } from '../Function';

var GnCount = 1;

export const errorCodes = {
  '5': 'not login to admin'
};

const hex = (d) => {
  var hD = '0123456789ABCDEF';
  var h = hD.substr(d & 15, 1);
  while (d > 15) {
    d >>= 4;
    h = hD.substr(d & 15, 1) + h;
  }

  return h;
};

const _getValue = (authstr) => {
  var arr = authstr.split('=');
  return arr[1].substring(1, arr[1].indexOf('\"', 2));
};

/**
 * 
 * @param {string} requestType 
 * @param {string} username 
 * @param {string} password 
 * @param {string} Authrealm 
 * @param {string} nonce 
 * @param {string} AuthQop 
 * @returns {string} return value for Authorization header login
 */
const _getAuthHeader = (requestType, username, password, Authrealm, nonce, AuthQop) => {
  let rand, date, salt, strAuthHeader;
  let tmp, DigestRes, AuthCnonce_f;
  let HA1, HA2;

  HA1 = MD5(username + ':' + Authrealm + ':' + password).toString();
  HA2 = MD5(requestType + ':' + '/cgi/xml_action.cgi').toString();

  rand = Math.floor(Math.random() * 100001);
  date = new Date().getTime();

  salt = rand + '' + date;
  tmp = MD5(salt).toString();
  AuthCnonce_f = tmp.substring(0, 16);

  let strhex = hex(GnCount);
  let temp = '0000000000' + strhex;
  let Authcount = temp.substring(temp.length - 8);
  DigestRes = MD5(HA1 + ':' + nonce + ':' + Authcount + ':' + AuthCnonce_f + ':' + AuthQop + ':' + HA2);

  GnCount++;
  strAuthHeader = 'Digest ' + 'username="' + username + '", realm="' + Authrealm + '", nonce="' + nonce + '", uri="' + '/cgi/xml_action.cgi' + '", response="' + DigestRes + '", qop=' + AuthQop + ', nc=' + Authcount + ', cnonce="' + AuthCnonce_f + '"';
  return strAuthHeader;
};

/**
 * 
 * @param {string} url url login for get Authorization headers
 * @returns {string} if status 200 
 * @returns {boolean} if failed  
 */
export const _getAuthType = (url) => {
  CookieManager.clearAll();

  return new Promise(async (resolve, reject) => {
    try {
      const headers = {
        'Expires': '-1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log('result authType', result);

      const response = result.respInfo;
      if (response.status === 200) {
        const responseHeaders = lowercaseObjectKeys(response.headers);
        const authenticate = responseHeaders['www-authenticate'];
        // console.log(123, authenticate)
        resolve(authenticate);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log('NotionModemAPI@getAuthType_error', error.message);
      console.log('NotionModemAPI@getAuthType_errorResponse', error.response);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP url domain admin
 * @returns {boolean} if success return true, if error/failed return false
 * @returns {string} if response have error_cause
 */
export const _getModemLoginStatusNotion = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!modemIP) {
        modemIP = store.getState().globalData.modemIP;
      }

      /* start xml */
      const body = {
        'RGW': {
          'param': {
            'method': 'call',
            'session': '000',
            'obj_path': 'account',
            'obj_method': 'get_account'
          }
        }
      };

      const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
      const buildXml = builder.buildObject(body);
      /* end xml */

      const headers = {};

      const url = `https://${modemIP}/xml_action.cgi?method=set`;

      const result = await RNFetchBlobAdapter.post(url, headers, buildXml);
      // console.log("result login status", result);

      parseString(result.data, function (err, _result) {
        if (err) {
          resolve(false);
        }
        // console.log("result login status", _result)

        const isLogin = ('account_info' in _result.RGW)
          ? true
          : ('error_cause' in _result.RGW)
            ? _result.RGW.error_cause[0]
            : false;

        // console.log("result login status", isLogin)
        resolve(isLogin);
      });
    } catch (error) {
      console.log('NotionModemAPI@getModemLoginStatus', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP url domain admin
 * @param {string} user username login
 * @param {string} pass password login
 * @returns {boolean} if "status=0" that mean login success return true, if error/failed return false
 * @returns {string} if response not "status=0"
 * status=0 --> login success
 * status=1 --> wrong username
 * status=2 --> wrong password
 * status=3 --> wrong username & password
 * status=4 --> wrong username or password 4x
 * status=5 --> wrong username or password 5x and need wait 300 second for retry (space = 300)
 */
export const _postModemLoginNotion = async (modemIP = '192.168.8.1', user = 'admin', pass = 'admin') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      user = user ? user : globalData.modemUsername;
      pass = pass ? pass : modemData.attributes.passwordRouter;

      let urlLogin = `https://${modemIP}/login.cgi`;
      const loginParam = await _getAuthType(urlLogin);
      // console.log('loginParam', loginParam);

      if (loginParam) {
        const loginParamArray = loginParam.split(' ');
        if (loginParamArray[0] == 'Digest') {
          let Authrealm = _getValue(loginParamArray[1]);
          let nonce = _getValue(loginParamArray[2]);
          let AuthQop = _getValue(loginParamArray[3]);

          let username = user;
          let password = pass;
          let rand, date, salt;

          let tmp, DigestRes;
          let HA1, HA2;

          HA1 = MD5(username + ':' + Authrealm + ':' + password).toString();
          HA2 = MD5('GET' + ':' + '/cgi/xml_action.cgi').toString();

          rand = Math.floor(Math.random() * 100001);
          date = new Date().getTime();

          salt = rand + '' + date;
          tmp = MD5(salt).toString();
          let AuthCnonce = tmp.substring(0, 16);

          let strhex = hex(GnCount);
          let temp = '0000000000' + strhex;
          let Authcount = temp.substring(temp.length - 8);
          DigestRes = MD5(HA1 + ':' + nonce + ':' + Authcount + ':' + AuthCnonce + ':' + AuthQop + ':' + HA2).toString();

          const headers = {
            'Authorization': _getAuthHeader('GET', username, password, Authrealm, nonce, AuthQop),
            'Expires': '-1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          };

          const url = `https://${modemIP}/login.cgi?Action=${loginParamArray[0]}&username=${username}&realm=${Authrealm}&nonce=${nonce}&response=${DigestRes}&qop=${AuthQop}&cnonce=${AuthCnonce}&nc=${Authcount}&temp=marvell`;

          const result = await RNFetchBlobAdapter.get(url, headers);

          const response = result.respInfo;
          const responseHeaders = lowercaseObjectKeys(response.headers);
          const authenticateHeaders = responseHeaders['www-authenticate'];
          const resultHeaders = authenticateHeaders.split(',');

          if (resultHeaders[0] == 'status=0') {
            resolve(true);
          } else {
            resolve(resultHeaders[0]);
          }
        }
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log('NotionModemAPI@postModemLogin', error.message);
      console.log('NotionModemAPI@postModemLogin', error.response);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP url domain admin
 * @returns {boolean}
 */
export const _postModemLogoutNotion = async (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    const url = `https://${modemIP}/xml_action.cgi?Action=logout`;

    try {
      const headers = {};

      const result = await RNFetchBlobAdapter.get(url, headers);
      // console.log("result logout", result);

      // parseString(result.data, function (err, result) {
      //   console.log("logout", result)
      // });
      resolve(true);
    } catch (error) {
      console.log('NotionModemAPI@postModemLogout', error.message);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP url domain admin
 * @param {string} user username login
 * @param {string} newPass new password for changing default password "admin", value we get from  memberDevice
 * @param {string} oldPass default password "admin"
 * @returns {object} if response included "setting_response: OK" that mean success change password admin
 */
export const _postChangeAdminPasswordNotion = async (modemIP = '192.168.8.1', user = 'admin', newPass = 'admin', oldPass = 'admin') => {
  try {
    await _postModemLoginNotion(modemIP, user, oldPass);

    let isLogin = await _getModemLoginStatusNotion(modemIP);
    // console.log("is login", isLogin);
    if (!isLogin) {
      return false;
    }

    // console.log("step 1, login status", isLogin);
    // console.log("user: ", user, "pass: ", newPass, "oldPass: ", oldPass);

    if (isLogin) {
      /* start xml */
      const body = {
        'RGW': {
          'param': {
            'method': 'call',
            'session': '000',
            'obj_path': 'account',
            'obj_method': 'set_account'
          },
          'account': {
            'user_management': {
              'action': '1',
              'username': user,
              'password': newPass
            }
          }
        }
      };

      // console.log('step 2', body);

      const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
      const buildXml = builder.buildObject(body);
      /* end xml */

      // console.log('step 3', 'unlock modem');

      const headers = {};

      const url = `https://${modemIP}/xml_action.cgi?method=set`;
      // console.log("Body Request", buildXml);

      const resultChangePassword = await RNFetchBlobAdapter.post(url, headers, buildXml);

      return new Promise((resolve, reject) => {
        parseString(resultChangePassword.data, function (err, _result) {
          if (err) {
            resolve(false);
          }
          resolve(_result.RGW);
        });
      });
    }

    return false;
  } catch (error) {
    console.log('NotionModemAPI@postChangeAdminPassword', error.message);
    return false;
  }
};

/**
 * 
 * @param {string} modemIP 
 * @returns {boolean} return true if login and false if not login
 */
export const _getHeartBeatNotion = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;

      const isLogin = await _getModemLoginStatusNotion(modemIP);

      if (isLogin) {
        resolve(true);
        return true;
      }

      resolve(false);
    } catch (error) {
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP 
 * @returns {object} result from API response
 */
export const _getDeviceInformationNotion = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;

      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      // console.log("result loginModem", isLogin);

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        /* start xml */
        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'cm',
              'obj_method': 'get_link_context'
            }
          }
        };

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);

        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);
        parseString(result.data, function (err, _result) {
          // console.log('getDeviceInformationNotion response', _result)
          if (err) {
            resolve(false);
          }

          resolve(_result.RGW);
          return _result.RGW;
        });
      }

      resolve(false);
    } catch (error) {
      console.log('NotionModemAPI@getDeviceInformationNotion', error.message);
      console.log('NotionModemAPI@getDeviceInformationNotion', error.response);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP 
 * @param {string} password SSID password
 * @param {string} wifiSSID SSID Name
 * @returns it will not get result because the wifi will change and connection lost, and we handle it on catch because that mean we success change wifi name or password
 */
export const _postChangeSSIDPasswordNotion = (modemIP = '192.168.8.1', password, wifiSSID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        /* start xml */
        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'wireless',
              'obj_method': 'wifi_set_2.4g'
            },
            'wireless': {
              'wifi_if_24G': {
                'ssid': wifiSSID,
                'key': password,
                'ssid_index': '0'
              }
            }
          }
        };

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);

        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);
        resolve(result);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log('NotionModemAPI@postChangeSSIDPassword', error.message);
      if (Platform.OS === 'ios') {
        // Connection timed out because iPhone auto disconnect from wifi after modem success change ssid
        resolve(true);
      }

      const isFailedConnect = error.message.includes('Failed to connect') && error.message.includes('192.168.8.1');
      if (isFailedConnect) {
        resolve(true);
      } else {
        resolve(false);
      }
    }
  });
};

/**
 * 
 * @param {string} modemIP domain for login admin
 * @param {string} username username login
 * @param {string} password passwor login
 * @returns {Array} return list of device connected to modem
 */
export const _getModemListConnectedNotion = (modemIP = '192.168.8.1', username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      username = username ? username : globalData.modemUsername;
      password = password ? password : modemData.attributes.passwordRouter;

      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin || isLogin != 0) {
        isLogin = await _postModemLoginNotion(modemIP, username, password);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        /* start xml */
        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'statistics',
              'obj_method': 'get_all_clients_info'
            }
          }
        };

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);

        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);
        // console.log("result getModemListConnectedNotion", result);
        if (result.data) {
          parseString(result.data, (err, _result) => {
            // console.log('getDeviceInformationNotion result obj', _result)
            if (err) {
              resolve(false);
            }

            const resultData = _result?.RGW?.clients_info?.[0];

            resolve(resultData?.one_client);
          });
        } else {
          resolve(false);
        }
      }

      resolve(false);
    } catch (error) {
      console.log('NotionModemAPI@getModemListConnectedNotion', error.message);
      console.log('NotionModemAPI@getModemListConnectedNotion', error.response);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {*} modemIP 
 * @param {*} user 
 * @param {*} pass 
 * @param {*} listDevice 
 * @returns 
 */
export const _postBlockDeviceNotion = async (modemIP, username, password, listDevice) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      username = username ? username : globalData.modemUsername;
      password = password ? password : modemData.attributes.passwordRouter;

      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, username, password);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};
        let body = {};

        listDevice.map((val, key) => {
          if (val.isBlocked !== null) {
            if (val.isBlocked) {
              body = {
                'RGW': {
                  'param': {
                    'method': 'call',
                    'session': '000',
                    'obj_path': 'statistics',
                    'obj_method': 'block_clients'
                  },
                  'statistics': {
                    'clients_mac': val.MACAddress
                  }
                }
              };
            } else {
              body = {
                'RGW': {
                  'param': {
                    'method': 'call',
                    'session': '000',
                    'obj_path': 'statistics',
                    'obj_method': 'unblock_clients'
                  },
                  'statistics': {
                    'clients_mac': val.MACAddress
                  }
                }
              };
            }
          }
        });

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);
        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

        if (result.data) {
          parseString(result.data, (err, resultParse) => {
            if(err) {
              return resolve(false);
            }

            try {
              resolve(resultParse.RGW);
            } catch (error) {
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      }

      resolve(false);
    } catch (error) {
      console.log('NotionModemAPI@postBlockDevice', error.message);
      console.log('NotionModemAPI@postBlockDevice', error.response);
      resolve(false);
    }
  });
};

/**
 * 
 * @param {string} modemIP 
 * @returns 
 */
export const _getTimeRuleNotion = (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        /* start xml */
        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'firewall',
              'obj_method': 'fw_get_parentctl_info'
            }
          }
        };

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);
        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

        parseString(result.data, function (err, _result) {
          if (err) {
            resolve(false);
          }
          resolve(_result.RGW);
          return _result.RGW;
        });

        resolve(result);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log('GET_TIME_RULE_ERR', error);
      resolve(false);
    }
  });
};


/**
 * 
 * @param {*} modemIP 
 * @param {*} endTime 
 * @param {*} devicesName 
 * @param {*} startTime 
 * @param {*} weekEnable 
 * @param {*} devicesMac 
 * @returns 
 */
export const _postTimeLimiNotion = async (modemIP, endTime, devicesName, startTime, weekEnable, devicesMac) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { globalData, modemData } = store.getState();
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      modemIP = modemIP ? modemIP : globalData.modemIP;

      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};
        let body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'firewall',
              'obj_method': 'fw_add_parentctl_entry'
            },
            'firewall': {
              'entry_list': {
                'entry_1': {
                  'enable': 1,
                  'start_time': startTime,
                  'end_time': endTime,
                  'week_days': weekEnable,
                  'mac': devicesMac,
                  'devname': devicesName
                }
              }
            }
          }
        };

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);
        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

        if (result.data) {
          parseString(result.data, (err, resultParse) => {
            if(err) {
              return resolve(false);
            }

            try {
              resolve(resultParse.RGW);
            } catch (error) {
              resolve(false);
              console.log('NotionModemAPI@_postTimeLimit', error);
            }
          });
        } else {
          resolve(false);
        }
      }

      resolve(false);
    } catch (error) {
      console.log('NotionModemAPI@postLimitRule', error.message);
      console.log('NotionModemAPI@postLimitRule', error.response);
      resolve(false);
    }
  });
};

export const _postTimeRuleNotion = async (modemIP, dataConfig) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { globalData, modemData } = store.getState();
      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;

      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      const indexValue = dataConfig.indexValue + 1;
      const entry_value = `entry_${indexValue}`;

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};
        let body = {};

        if (dataConfig?.isDelete) {
          body = {
            'RGW': {
              'param': {
                'method': 'call',
                'session': '000',
                'obj_path': 'firewall',
                'obj_method': 'fw_del_parentctl_entry'
              },
              'firewall': {
                'index': `${indexValue},`
              }
            }
          };
        } else {
          body = {
            'RGW': {
              'param': {
                'method': 'call',
                'session': '000',
                'obj_path': 'firewall',
                'obj_method': 'fw_edit_parentctl_entry'
              },
              'firewall': {
                'entry_list': {
                  [entry_value]: {
                    'enable': dataConfig.enable ? 1 : 0,
                    'start_time': dataConfig.startTime,
                    'end_time': dataConfig.endTime,
                    'week_days': dataConfig.weekEnable
                  }
                }
              }
            }
          };
        }

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);
        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

        if (result.data) {
          parseString(result.data, (err, resultParse) => {
            if (err) {
              resolve(false);
            }

            try {
              resolve(resultParse.RGW);
            } catch (error) {
              resolve(false);
              console.log('NotionModemAPI@_postTimeLimit', error);
            }
          });
        } else {
          resolve(false);
        }
      }

      resolve(false);
    } catch (error) {
      console.log('NotionModemAPI@postTimeRule', error.message);
      console.log('NotionModemAPI@postTimeRule', error.response);
      resolve(false);
    }
  });
};

export const _getGuestSSIDStatusNotion = async (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {

      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        /* start xml */
        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'wireless',
              'obj_method': 'wifi_get_detail'
            }
          }
        };

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);
        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

        parseString(result.data, function (err, _result) {
          if (err) {
            resolve(false);
          }
          resolve(_result.RGW);
          return _result.RGW;
        });
      } else {
        resolve(false);
      }

    } catch (error) {
      console.log('NotionModemAPI@_getGuestSSIDStatusNotion', error.message);
      console.log('NotionModemAPI@_getGuestSSIDStatusNotion', error.response);
      resolve(false);
    }
  });
};

export const _activateGuestSSIDNotion = async (modemIP = '192.168.8.1', status, guestSsidData) => {
  return new Promise(async (resolve, reject) => {
    try {

      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        /* start xml */
        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'wireless',
              'obj_method': 'wifi_set_2.4g'
            },
            'wireless': {
              'wifi_if_24G': {
                'ssid': guestSsidData?.wifiName,
                'key': guestSsidData?.wifiPassword,
                'disabled': status,
                'ssid_index': 1
              }
            }
          }
        };

        try {
          const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
          const buildXml = builder.buildObject(body);

          const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

          parseString(result.data, function (err, _result) {
            if (err) {
              resolve(false);
            }
            resolve(_result.RGW);
            return _result.RGW;
          });
        } catch (error) {
          const myInterval = setInterval(async () => {
            const getDevice = await _getDeviceInformationNotion(modemIP);
            if (getDevice) {
              clearInterval(myInterval);
              resolve(getDevice);
            }
          }, 5000);
        }

      } else {
        resolve(false);
      }

    } catch (error) {
      console.log('NotionModemAPI@_activateGuestSSIDNotion', error.message);
      console.log('NotionModemAPI@_activateGuestSSIDNotion', error.response);
      resolve(false);
    }
  });
};

export const _postChangeSSIDPasswordGuestNotion = async (modemIP = '192.168.8.1', wifiName, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        /* start xml */
        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'wireless',
              'obj_method': 'wifi_set_2.4g'
            },
            'wireless': {
              'wifi_if_24G': {
                'ssid': wifiName,
                'key': password,
                'disabled': 0,
                'ssid_index': 1
              }
            }
          }
        };

        try {
          const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
          const buildXml = builder.buildObject(body);
          const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

          parseString(result.data, function (err, _result) {
            if (err) {
              resolve(false);
            }
            resolve(_result.RGW);
            return _result.RGW;
          });
        } catch (error) {
          const myInterval = setInterval(async () => {
            const getDevice = await _getDeviceInformationNotion(modemIP);
            if (getDevice) {
              clearInterval(myInterval);
              resolve(getDevice);
            }
          }, 5000);
        }
      } else {
        resolve(false);
      }

    } catch (error) {
      console.log('NotionModemAPI@_postChangeSSIDPasswordGuestNotion', error.message);
      console.log('NotionModemAPI@_postChangeSSIDPasswordGuestNotion', error.response);
    }
  });
};

export const _getUrlFilteringNotion = async (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        /* start xml */
        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'firewall',
              'obj_method': 'fw_get_dn_filter_info'
            }
          }
        };

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);
        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

        parseString(result.data, function (err, _result) {
          if (err) {
            resolve(false);
          }
          resolve(_result.RGW);
          return _result.RGW;
        });
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log('NotionModemAPI@_getUrlFilteringNotion', error.message);
      console.log('NotionModemAPI@_getUrlFilteringNotion', error.response);
    }
  });
};

/**
 * 
 * @param {*} modemIP 
 * @param {*} filteringArray 
 * @returns 
 */
export const _postUrlFilteringNotion = async (modemIP = '192.168.8.1', filteringArray) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};
        let urlfilter = [];
        let dataEntry = {};

        filteringArray.map((val, key) => {
          let data = {
            value: val.url,
            status: 1
          };
          urlfilter.push(data);
        });

        const dataoObject = Object.values(urlfilter).map((item, key) => {
          const entry_value = `entry_${Number(key) + 1}`;
          let data = {
            [entry_value]: {
              'start_time': '00:00',
              'stop_time': '23:59',
              'domain_name': item.value,
              'enabled': item.status
            }
          };
          return data;
        });

        dataoObject.map((item) => {
          Object.assign(dataEntry, item);
        });

        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'firewall',
              'obj_method': 'add_dn_filter_entry'
            },
            'firewall': {
              'dn_filter': {
                'entry_list': dataEntry
              }
            }
          }
        };

        try {
          const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
          const buildXml = builder.buildObject(body);
          const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

          parseString(result.data, function (err, _result) {
            if (err) {
              resolve(false);
            }
            resolve(_result.RGW);
            return _result.RGW;
          });
        } catch (error) {
          const myInterval = setInterval(async () => {
            const getDevice = await _getDeviceInformationNotion(modemIP);
            if (getDevice) {
              clearInterval(myInterval);
              resolve(getDevice);
            }
          }, 5000);
        }
      } else {
        resolve(false);
      }

    } catch (error) {
      console.log('NotionModemAPI@_postUrlFilteringNotion', error.message);
      console.log('NotionModemAPI@_postUrlFilteringNotion', error.response);
    }
  });
};

/**
 * 
 * @param {*} modemIP 
 * @param {*} filteringArray 
 * @returns 
 */
export const _postEditUrlFilteringNotion = async (modemIP = '192.168.8.1', filteringArray, index, toogle = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};
        let urlfilter = [];

        filteringArray.map((val, key) => {
          let data = {
            value: val?.url ? val.url : val?.list[0]?.url,
            status: 1
          };
          urlfilter.push(data);
        });

        const dataoObject = Object.values(urlfilter).map((item, key) => {
          const entry_value = `entry_${Number(key) + 1}`;
          let data = {
            [entry_value]: {
              'domain_name': item.value,
              'enabled': toogle !== '' ? toogle : item.status
            }
          };
          return data;
        });

        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'firewall',
              'obj_method': 'edit_dn_filter_entry'
            },
            'firewall': {
              'dn_filter': {
                'entry_list': dataoObject[index]
              }
            }
          }
        };

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);
        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

        parseString(result.data, function (err, _result) {
          if (err) {
            resolve(false);
          }
          resolve(_result.RGW);
          return _result.RGW;
        });

        resolve(false);
      } else {
        resolve(false);
      }

    } catch (error) {
      console.log('NotionModemAPI@_postEditUrlFilteringNotion', error.message);
      console.log('NotionModemAPI@_postEditUrlFilteringNotion', error.response);
    }
  });
};

/**
 * 
 * @param {*} modemIP 
 * @param {*} filteringArray 
 * @returns 
 */
export const _postDeleteUrlFilteringNotion = async (modemIP = '192.168.8.1', filteringArray, index) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};
        let urlfilter = [];
        let dataEntry = '';

        filteringArray.map((val, key) => {
          let data = {
            value: val.url,
            status: 1
          };
          urlfilter.push(data);
        });

        Object.keys(urlfilter).forEach(x => {
          dataEntry += `${Number(x) + 1},`;
        });

        // const entry_value = `${Number(index) + 1},`

        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'firewall',
              'obj_method': 'delete_dn_filter_entry'
            },
            'firewall': {
              'del_dn_filter_index': dataEntry
            }
          }
        };

        try {
          const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
          const buildXml = builder.buildObject(body);
          const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

          parseString(result.data, function (err, _result) {
            if (err) {
              resolve(false);
            }
            resolve(_result.RGW);
            return _result.RGW;
          });

          resolve(false);
        } catch (error) {
          const myInterval = setInterval(async () => {
            const getDevice = await _getDeviceInformationNotion(modemIP);
            if (getDevice) {
              clearInterval(myInterval);
              resolve(getDevice);
            }
          }, 5000);
        }
      } else {
        resolve(false);
      }

    } catch (error) {
      console.log('NotionModemAPI@_postDeleteUrlFilteringNotion', error.message);
      console.log('NotionModemAPI@_postDeleteUrlFilteringNotion', error.response);
    }
  });
};

export const _postDisableUrlFilteringNotion = async (modemIP = '192.168.8.1', websiteFiltering) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'firewall',
              'obj_method': 'fw_set_disable_info'
            },
            'firewall': {
              'disable': websiteFiltering ? 0 : 1, // Disable = 0, Enable = 1
              'dn_filter_disable': websiteFiltering ? 0 : 1, // Disable = 0, Enable = 1
            }
          }
        };

        try {
          const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
          const buildXml = builder.buildObject(body);
          const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

          parseString(result.data, function (err, _result) {
            if (err) {
              resolve(false);
            }
            resolve(_result.RGW);
            return _result.RGW;
          });
        } catch (error) {
          const myInterval = setInterval(async () => {
            const getDevice = await _getDeviceInformationNotion(modemIP);
            if (getDevice) {
              clearInterval(myInterval);
              resolve(getDevice);
            }
          }, 5000);
        }

        resolve(false);
      } else {
        resolve(false);
      }

    } catch (error) {
      console.log('NotionModemAPI@_postDisableUrlFilteringNotion', error.message);
      console.log('NotionModemAPI@_postDisableUrlFilteringNotion', error.response);
    }
  });
};

export const _getDisableEnableUrlFilterNotion = async (modemIP = '192.168.8.1') => {
  return new Promise(async (resolve, reject) => {
    try {

      const { modemData, globalData } = store.getState();

      modemIP = modemIP ? modemIP : globalData.modemIP;
      const user = globalData.modemUsername;
      const pass = modemData.attributes.passwordRouter;
      let isLogin = await _getModemLoginStatusNotion(modemIP);

      if (!isLogin) {
        isLogin = await _postModemLoginNotion(modemIP, user, pass);
      }

      if (isLogin) {
        const url = `https://${modemIP}/xml_action.cgi?method=set`;
        const headers = {};

        const body = {
          'RGW': {
            'param': {
              'method': 'call',
              'session': '000',
              'obj_path': 'firewall',
              'obj_method': 'fw_get_disable_info'
            }
          }
        };

        const builder = new xml2js.Builder({ xmldec: { encoding: 'US-ASCII' } });
        const buildXml = builder.buildObject(body);
        const result = await RNFetchBlobAdapter.post(url, headers, buildXml);

        parseString(result.data, function (err, _result) {
          if (err) {
            resolve(false);
          }
          resolve(_result.RGW);
          return _result.RGW;
        });

        resolve(false);
      } else {
        resolve(false);
      }

    } catch (error) {
      console.log('NotionModemAPI@_getDisableEnableUrlFilterNotion', error.message);
      console.log('NotionModemAPI@_getDisableEnableUrlFilterNotion', error.response);
    }
  });
};
