import { PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import NetInfo from '@react-native-community/netinfo';
import WifiManager from 'react-native-wifi-reborn';

import { sentryCapture } from './SentryLib';
import { store } from '../Config/Store';
import { ToastHandler } from './MobileHelper';
import { errorCodes } from './ModemAPI/HuaweiModemAPI';
import deviceInfoModule from 'react-native-device-info';

import {
  SET_FIRMWARE_VERSION,
  SET_MODAL_SHOW_STATUS,
  SET_MODEM_CONNECTED,
  SET_MODEM_DATA,
  SET_MODEM_FEATURE
} from '../Config/Reducer';
import { getModemFeature, postChangeMemberDeviceData } from './ActionGlobal';
import {
  getHeartBeat,
  getModemFirmwareVersion,
  getModemIsConnectedToInternet,
  getModemLoginStatus,
  getModemSession,
  postModemLogin
} from './Driver';

var hearbeatInterval = false;
var retryCount = 0;

const HUAWEI = 'HUAWEI';
const NOTION = 'NOTION';
const ZTE = 'ZTE';
const ADVAN = 'ADVAN';
const MEIG = 'MEIG';

export const clearModemStatusSSIDIsConnected = () => {
  clearInterval(hearbeatInterval);
};

export const initHeartBeat = () => {
  try {
    const { globalData } = store.getState();

    clearModemStatusSSIDIsConnected();

    const modemIP = globalData.modemIP;
    hearbeatInterval = false;
    hearbeatInterval = setInterval(async () => {
      try {
        const { modemData, modemType } = store.getState();

        if (modemData && typeof modemData == 'object' && 'attributes' in modemData) {
          try {
            let userLevel = false;
            let resultHeartBeat = await getHeartBeat(modemIP);
            // let resultHeartBeat = true; // for development perpose
            // console.log("resultHeartBeat", resultHeartBeat);

            switch (modemType) {
              case HUAWEI:
                if (resultHeartBeat) {
                  userLevel = resultHeartBeat.response.userlevel[0];
                }
                break;
              case NOTION:
                if (resultHeartBeat == true) {
                  userLevel = 1;
                }
                break;
              case ZTE:
                if (resultHeartBeat == true) {
                  userLevel = 1;
                }
                break;
              case ADVAN:
                if (resultHeartBeat == true) {
                  userLevel = 1;
                }
                break;
              default:
                break;
            }

            // const userLevelValuesIfModemIsConnected = [1, 2]

            store.dispatch({
              type: SET_MODEM_CONNECTED,
              data: (userLevel == 1 || userLevel == 2) ? true : false
            });
          } catch (error) {
            sentryCapture(`Heartbeat Error ${JSON.stringify}`);
          }
        }
      } catch (error) {
        sentryCapture(`Heartbeat Error ${JSON.stringify}`);
      }
    }, 10000);
  } catch (error) {
    console.log('Heartbeat Error ', error);
    sentryCapture(`Heartbeat Error ${JSON.stringify}`);
  }
};

export const showPopupResetModem = (status, isReset = false) => {
  store.dispatch({
    type: SET_MODAL_SHOW_STATUS,
    modalShowStatus: {
      showResetModal: status,
      isReset: isReset
    }
  });
};

const _loginIntoModem = async (username, password) => {
  return new Promise(async (resolve, _reject) => {
    const { language, modemType } = store.getState();
    const modemIP = '192.168.8.1';
  
    const resultModemLogin = await postModemLogin(username, password);
    // console.log('resultModemLogin', resultModemLogin);

    const wordingConnectedToModem = language == 'id' ? 'Sukses login ke modem' : 'Successfully logged in to the modem';
    const wordingFailedConnectedToModem = language == 'id' ? 'Gagal login ke modem, status: ' : 'Failed to log in to modem, status: ';
    const wordingNotConnectedWithOrbit = language == 'id' ? 'Anda tidak terkoneksi ke Jaringan Orbit' : 'You are not connected to the Orbit Network';
    let isModemConnected = false;
  
    if (modemType == HUAWEI) {
      if (resultModemLogin === true) {
        getModemIsConnectedToInternet(modemIP);
        ToastHandler(wordingConnectedToModem);
        isModemConnected = true;
  
        resolve(true);
      } else {
        if (resultModemLogin in errorCodes && errorCodes[resultModemLogin]) {
          ToastHandler((wordingFailedConnectedToModem) + (resultModemLogin in errorCodes && errorCodes[resultModemLogin]));
  
          sentryCapture('status: ' + (resultModemLogin in errorCodes && errorCodes[resultModemLogin]), 'Gagal login ke modem');
          if (resultModemLogin === '108006') {
            showPopupResetModem(true);
          } else if (resultModemLogin === '108007') {
            showPopupResetModem(true);
          }
  
          resolve(false);
        } else {
          ToastHandler(wordingNotConnectedWithOrbit);
          resolve(false);
        }

        isModemConnected = false;
      }
    } else if (modemType == NOTION) {
      // resultModemLogin: boolean | string
      if (resultModemLogin === true) {
        ToastHandler(wordingConnectedToModem);
        isModemConnected = true;

        resolve(true);
      } else {
        isModemConnected = false;

        if (typeof resultModemLogin === 'string' && resultModemLogin !== 'status=0') {
          showPopupResetModem(true);
          resolve(false);
        } else {
          ToastHandler(wordingNotConnectedWithOrbit);
          resolve(false);
        }
      }
    } else if (modemType == ZTE) {
      // resultModemLogin: boolean | string
      if (resultModemLogin.result == '0') {
        ToastHandler(wordingConnectedToModem);
        isModemConnected = true;
  
        resolve(true);
      } else {
        isModemConnected = false;

        if (resultModemLogin.result == '3') {
          showPopupResetModem(true);
          resolve(false);
        } else {
          ToastHandler(wordingNotConnectedWithOrbit);
          resolve(false);
        }
      }
    } else if (modemType == ADVAN) {
      // resultModemLogin: boolean | string
      if (resultModemLogin.result == '0') {
        ToastHandler(wordingConnectedToModem);
        isModemConnected = true;
  
        resolve(true);
      } else {
        isModemConnected = false;

        if (resultModemLogin.result == '3') {
          showPopupResetModem(true);
          resolve(false);
        } else {
          ToastHandler(wordingNotConnectedWithOrbit);
          resolve(false);
        }
      }
    } else if (modemType == MEIG) {
      /**
       * @returns {object}
       * exp: {
					isLogin: @returns {boolean},
					statusCode: @returns {number}
				}
       */
      if (resultModemLogin?.isLogin) {
        ToastHandler(wordingConnectedToModem);
        isModemConnected = true;
  
        resolve(true);
      } else {
        isModemConnected = false;

        if (resultModemLogin.statusCode) {
          showPopupResetModem(true);
          resolve(false);
        } else {
          ToastHandler(wordingNotConnectedWithOrbit);
          resolve(false);
        }
      }
    } else {
      isModemConnected = false;
      resolve(false);
    }

    setModemConnected(isModemConnected);
  });
};

export const setModemStatus = async () => {
  return new Promise(async (resolve, _reject) => {
    try {
      const { globalData, modemData, modemType } = store.getState();
  
      const modemUsername = globalData.modemUsername;
      const modemPassword = modemData.attributes.passwordRouter;
      const listModemWithNewMethod = ['MEIG'];
      let isModemConnected = false;
  
      if (!modemData) {
        return false;
      }

      const modemLoginStatus = await getModemLoginStatus();

      if (listModemWithNewMethod.includes(modemType)) {
        if (modemLoginStatus?.isLogin) {
          isModemConnected = true;
          resolve(true);
        } else {
          const resultLoginToModem = await _loginIntoModem(modemUsername, modemPassword);
          isModemConnected = resultLoginToModem;

          resolve(resultLoginToModem);
        }
      } else {
        if (modemLoginStatus != 0) {
          const resultLoginToModem = await _loginIntoModem(modemUsername, modemPassword);
          isModemConnected = resultLoginToModem;

          resolve(resultLoginToModem);
        } else if (modemLoginStatus === '0' || modemLoginStatus === '-1' || modemLoginStatus === true || modemLoginStatus == '1') {
          isModemConnected = true;
          resolve(true);
        } else {
          const resultLoginToModem = await _loginIntoModem(modemUsername, modemPassword);
          isModemConnected = resultLoginToModem;

          resolve(resultLoginToModem);
        }
      }

      setModemConnected(isModemConnected);
    } catch (error) {
      // sentryCapture(`ModemLibrary@setModemStatus ${JSON.stringify(error)}`, "Gagal login ke modem");
      console.log('ModemLibrary@setModemStatus', error);
  
      setModemConnected(false);
      resolve(false);
    }
  });
};

export const setBESyncModemData = async () => {
  try {
    const { modemData } = store.getState();

    const ssid = modemData.attributes.ssid;
    const password = modemData.attributes.password;

    const body = {
      'ssid': ssid,
      'password': password
    };

    const resultUpdate = await postChangeMemberDeviceData(body);

    console.log('RESULT setBESyncModemData', resultUpdate);

    if (resultUpdate) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('ModemLibrary@setBESyncModemData', error);
    return false;
  }
};

export const getWifiConnectStatus = async (ssid) => {
  const resultNetInfo = await NetInfo.fetch();
  if (Platform.OS === 'ios') {
    // return true when testing on emulator
    return resultNetInfo.isConnected;
  } else {
    if (resultNetInfo.isWifiEnabled) {
      if ('details' in resultNetInfo && resultNetInfo.details.ssid == ssid) {
        return true;
      }

      return false;
    }
  }

  return false;
};

export const setModemConnected = async (isModemConnected) => {
  await store.dispatch({
    type: SET_MODEM_CONNECTED,
    data: isModemConnected
  });

  return true;
};

export const forceFetchDataOnWifi = async (status) => {
  console.log('-- force fetch data on wifi', status);
  return await WifiManager.forceWifiUsage(status);
};

export const forgetWifiSSID = (ssid) => {
  return new Promise(async (resolve, reject) => {
    try {
      await WifiManager.isRemoveWifiNetwork(ssid, (status) => {
        console.log(`ModemLibrary@forgetWifiSSID ${status}`);
        resolve(true);
      });
    } catch (error) {
      resolve(false);
      sentryCapture(`ModemLibrary@forgetWifiSSID ${JSON.stringify(error)}`, 'Gagal forget wifi');
      console.log(`ModemLibrary@forgetWifiSSID ${JSON.stringify(error)}`);
    }
  });
};

export const wifiEnable = (status = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS == 'android') {
        if (status) {
          WifiManager.isEnabled(isEnabled => {
            if (isEnabled) {
              console.log('wifi service enabled');
              setTimeout(() => {
                resolve(true);
              }, 1000);
              resolve(true);
            } else {
              setTimeout(() => {
                WifiManager.setEnabled(status);
                resolve(true);
              }, 1000);
            }
          });
        } else {
          WifiManager.setEnabled(status);
        }
        return;
      }

      resolve(false);
    } catch (error) {
      sentryCapture(`ModemLibrary@_wifiEnable status:${status} ${JSON.stringify(error)}`, 'Gagal mendapatkan status driver wifi');
      console.log('ModemLibrary@_wifiEnable', error);
      resolve(false);
    }
  });
};

export const wifiAskForUserPermissions = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Wifi networks',
            'message': 'We need your permission in order to find wifi networks'
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Thank you for your permission');
          resolve(true);
        } else {
          console.log('You will not able to retrieve wifi available networks list');
          resolve(false);
        }
      } else {
        const permissionRequestIos = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

        if (permissionRequestIos === RESULTS.GRANTED) {
          console.log('Thank you for your permission');
          resolve(true);
        } else {
          console.log('You will not able to retrieve wifi available networks list');
          resolve(false);
        }
      }
    } catch (err) {
      console.warn('ModemLibrary@_wifiAskForUserPermissions', JSON.stringify(err));
      resolve(false);
    }
  });
};

export const wifiGetSSIDCurrent = () => {
  return new Promise(async (resolve, reject) => {
    try {
      WifiManager.getCurrentWifiSSID().then(
        ssid => {
          console.log('Your current connected wifi SSID is ' + ssid);
          resolve(ssid);
        }, () => {
          console.log('Cannot get current SSID!');
          resolve(false);
        }
      );
    } catch (error) {
      resolve(false);
    }
  });
};

export const wifiConnectSSID = (SSID, pass) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS == 'android') {
        const wifiCurrent = await wifiGetSSIDCurrent();
        console.log('wifiCurrent', wifiCurrent);

        if (wifiCurrent == SSID) {
          resolve('found');
        } else {
          await wifiEnable(true);
          WifiManager.loadWifiList((wifilist) => {
            if (wifilist.indexOf(SSID)) {
              WifiManager.getCurrentWifiSSID().then(
                res => {
                  if (res == SSID) {
                    console.log('Connected successfully!');
                    resolve('found');
                  } else {
                    console.log('Connection failed!');
                    resolve('notfound');
                  }
                }, () => {
                  console.log('Cannot get current SSID!');
                  resolve('notfound');
                }
              );
            } else {
              resolve(false);
            }
          }, (err) => {
            console.log('ModemLibrary@wifiConnectSSID', err);
            resolve(false);
          });
        }
      } else {
        await WifiManager.connectToProtectedSSID(SSID, pass, true);
        resolve(true);
      }

    } catch (error) {
      console.log('== ERROR == ', error);
      sentryCapture(`ModemLibrary@wifiConnectSSID ${JSON.stringify(error)}`, 'Gagal terkoneksi ke SSID');
      try {
        console.log('=== trying to get without connect to modem == ');
        let resultModem = await getModemSession();

        console.log('=== trying to get without connect to modem == ');
        if (!resultModem) {
          throw new Error('');
        }
        resolve('found');
      } catch (err) {
        console.log('== ERROR 2 == ', err);
        resolve(false);
      }
    }
  });
};

export const setModemFirmwareVersion = async () => {
  try {
    const { modemData, modemType, globalData } = store.getState();
    const modemIP = globalData.modemIP;
    const modemUsername = globalData.modemUsername;
    const modemPassword = modemData.attributes.passwordRouter;

    const _getModemLoginStatus = await getModemLoginStatus();
    console.log('_getModemLoginStatus', _getModemLoginStatus);
    let isLoginModem = false;

    if (_getModemLoginStatus === '0' || _getModemLoginStatus === '-1' || _getModemLoginStatus === true) {
      isLoginModem = true;
    } else {
      const loginStatus = await _loginIntoModem(modemUsername, modemPassword);

      if (loginStatus) {
        isLoginModem = true;
      }
    }
    console.log('isLoginModem', isLoginModem);

    if (isLoginModem) {
      let firmwareVersion = false;
      const deviceInformation = await getModemFirmwareVersion(modemIP);
      // console.log("deviceInformation", deviceInformation);

      switch (modemType) {
        case HUAWEI:
          if (deviceInformation.response) {
            firmwareVersion = deviceInformation.response.SoftwareVersion[0].split('(')[0];
          }
          break;
        case NOTION:
          firmwareVersion = false;
          break;
        default:
          break;
      }

      await store.dispatch({
        type: SET_FIRMWARE_VERSION,
        data: firmwareVersion
      });
    }
  } catch (error) {
    console.log('ModemLibrary@setModemFirmwareVersion', error);

    return false;
  }
};

export const initGetModemFeature = async () => {
  try {
    const {
      accessTokenData,
      firmwareVersion,
      modemData,
      modemType
    } = store.getState();

    // Get app version
    const version = deviceInfoModule.getVersion().split('.');
    version.pop();
    const versionApp = version.join('.');

    // Get payload data
    const data = {
      versionApp: `v${versionApp}`,
      deviceModel: modemData?.attributes?.packageType,
      firmwareVersion: firmwareVersion ? `${modemType}_${firmwareVersion}` : false
    };

    // Get response
    const result = await getModemFeature(accessTokenData?.accessToken, data);
    const resultCode = result?.data?.code;
    const resultData = result?.data?.data;

    // Handle error toast based on error code
    if (resultCode == 204) {
      ToastHandler('Modem Feature tidak tersedia, silahkan hubungi Customer Service');
    } else if (resultCode === 404) {
      ToastHandler('Gagal mendapatkan Modem Feature, silakan refresh Dashboard');
    }

    // Store data
    store.dispatch({
      type: SET_MODEM_FEATURE,
      data: resultData
    });

    return;
  } catch (error) {
    ToastHandler('Gagal mendapatkan Modem Feature, silakan refresh Dashboard');

    // Reset data
    store.dispatch({
      type: SET_MODEM_FEATURE,
      data: null
    });

    return;
  }
};

export const reconnectWithSSID = (wifiName, wifiPassword) => {
  return new Promise(async (resolve, reject) => {
    this._handlerProgress(50);
    await wifiEnable();

    const { language } = store.getState();
    const toastId = `Harap forget wifi : ${wifiName} atau koneksikan menggunakan password: "${wifiPassword}"`;
    const toastEn = `Please forget the wifi : ${wifiName} or connect using a password: "${wifiPassword}"`;

    const resultWifiConnect = await wifiConnectSSID(wifiName, wifiPassword);
    console.log('resultWifiConnect', resultWifiConnect);

    if (resultWifiConnect == 'found') {
      resolve(true);
    } else {
      retryCount++;

      if(retryCount < 2) {
        resolve(await this._handlerReconnectWithSSID());
      } else {
        await forgetWifiSSID(wifiName);
        ToastHandler(language == 'id' ? toastId : toastEn);
        resolve(false);
      }
    }
  });
};
