// HuaweiModemAPI.js

// import '../../../shim';
import { Platform } from 'react-native';
import { Buffer } from 'buffer';
import Axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import CryptoJS from 'crypto-js';
import xml2js, { parseString } from 'react-native-xml2js';
import { doRSAEncrypt } from '@abiyyualifandin/huawei-modem-encryption';

import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { sentryCapture } from '../SentryLib';
import { store } from '../../Config/Store';

Axios.defaults.withCredentials = true;
Axios.defaults.timeout = 10000;

let modemSessionCache = false;
let isSessionGet = false;

export const errorCodes = {
	'9003': 'Rule already set',
	'100002': 'No support',
	'100003': 'Access denied',
	'100004': 'Busy',
	'100008': 'Unknown', // ??
	'108001': 'Wrong username',
	'108002': 'Wrong password',
	'108006': 'Wrong password', // ??
	'108003': 'Already logged in',
	'108007': 'Error, login to many times',
	'120001': 'Voice busy',
	'125001': 'Wrong __RequestVerificationToken header',
	'125002': 'Bad request, generic', // ??
	'125003': 'Session tokens missing' // ??
};

const sha256andbase64 = (user, pass, token) => {
	const encryptedPassword64 = new Buffer(CryptoJS.createHash('sha256').update(pass).digest('hex'), 'utf-8').toString('base64');
	const hashStep2 = user + encryptedPassword64 + token;
	const step2 = new Buffer(CryptoJS.createHash('sha256').update(hashStep2).digest('hex'), 'utf-8').toString('base64');

	return step2;
};

const base64newPassword = (newPassword) => {
	return new Buffer(newPassword, 'utf-8').toString('base64');
};

export const _getModemLoginStatusHuawei = (modemIP = '192.168.8.1', isResult) => {
	if (!modemIP) {
		modemIP = store.getState().globalData.modemIP;
	}

	return new Promise(async (resolve, _reject) => {
		const url = `http://${modemIP}/api/user/state-login`;
		const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
		const options = {
			timeout: 5000,
			headers: {
				...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
				'__RequestVerificationToken': tokInfo
			}
		};

		try {
			const resultGetLoginState = await Axios.get(url, options);
			if (isResult) {
				parseString(resultGetLoginState.data, async function (_err, result) {
					resolve(result);
				});
			} else {
				parseString(resultGetLoginState.data, async function (_err, result) {
					if (result && 'response' in result && 'State' in result.response) {
						resolve(result.response.State[0]);
					} else {
						resolve(false);
					}
				});
			}
		} catch (error) {
			sentryCapture(`HuaweiModemAPI@_getModemLoginStatusHuawei ${JSON.stringify(error)}`, 'Gagal mendapatkan login status');

			console.log('HuaweiModemAPI@_getModemLoginStatusHuawei', error);
			resolve(false);
		}
	});
};

/* UNUSED */
export const _getModemIsConnectedToInternetHuawei = (modemIP = '192.168.8.1') => {
	return new Promise(async (resolve, _reject) => {
		const loginStatus = await _getModemLoginStatusHuawei(modemIP, false);

		if (loginStatus != '0') {
			await _postModemLoginHuawei();
		}

		const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
		const options = {
			headers: {
				...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
				'__RequestVerificationToken': tokInfo
			}
		};

		AxiosAdapter.get(`http://${modemIP}/api/monitoring/status`,
			options
		)
			.then(function (response) {
				const responses = response.data;

				var xml = responses;
				parseString(xml, function (_err, result) {
					const status = result.response.ConnectionStatus[0];

					if (status == '901') {
						resolve(parseInt(status));
					} else if (status == '902') {
						resolve(parseInt(status));
					} else {
						resolve(true);
					}
				});
			})
			.catch(function (error) {
				sentryCapture(`HuaweiModemAPI@_getModemIsConnectedToInternetHuawei ${JSON.stringify(error)}`, 'Modem tidak terkoneksi ke internet');
				console.log('HuaweiModemAPI@_getModemIsConnectedToInternetHuawei', error);
				resolve(false);
			});
	});
};

export const _getModemSessionHuawei = async (modemIP = '192.168.8.1', isPairing = false) => {
	const timeOut = isPairing ? 5000 : 0;

	if (!modemIP) {
		modemIP = store.getState().globalData.modemIP;
	}

	return new Promise(async (resolve, _reject) => {
		if (!isSessionGet) {
			isSessionGet = true;
			setTimeout(async () => {
				// console.log("MS_step 1.1");

				const url = `http://${modemIP}/api/webserver/SesTokInfo`;

				try {
					const resultGetSesTok = await AxiosAdapter.get(url, { timeout: 5000 });

					parseString(resultGetSesTok.data, function (_err, result) {
						// console.log("MS_step 1.3");
						modemSessionCache = {
							sesInfo: result.response.SesInfo[0],
							tokInfo: result.response.TokInfo[0]
						};
						isSessionGet = false;

						console.log('cache session created');
						resolve(modemSessionCache);
					});

				} catch (error) {
					console.log('HuaweiModemAPI.action@_getModemSessionHuawei', error);
					isSessionGet = false;
					resolve(false);
				}
			}, timeOut);
		} else {
			setTimeout(async () => {
				if (!modemSessionCache) {
					resolve(await _getModemSessionHuawei(modemIP, isPairing));
				} else {
					console.log('cache session hitted');
					resolve(modemSessionCache);
				}
			}, 1000);
		}
	});
};

// export const _getModemSessionHuawei = async (modemIP = '192.168.8.1') => {
// 	return new Promise(async (resolve, reject) => {
// 		let sesTok = {
// 			sesInfo: false, 
// 			tokInfo: false
// 		};
// 		try {
// 			const url = `http://${modemIP}/api/webserver/SesTokInfo`;
// 			const resultGetSesTok = await AxiosAdapter.get(url, { timeout: 5000 });


// 			parseString(resultGetSesTok.data, function (err, result) {
// 				if(err) {
// 					return resolve(sesTok);
// 				}
// 				sesTok = {
// 					sesInfo: result.response.SesInfo[0],
// 					tokInfo: result.response.TokInfo[0]
// 				};

// 				console.log('cache session created');
// 				resolve(sesTok);
// 			});

// 		} catch (error) {
// 			console.log('HuaweiModemAPI.action@_getModemSessionHuawei', error);
// 			resolve(sesTok);
// 		}
// 	});
// };

/* UNUSED */
export const _getModemStatusInternetHuawei = async (modemIP = '192.168.8.1') => {
	const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
	const options = {
		headers: {
			...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
			'__RequestVerificationToken': tokInfo
		}
	};

	const url = `http://${modemIP}/api/monitoring/status`;
	try {
		const result = await AxiosAdapter.get(url, options);

		parseString(result.data, function (_err, result) {
			console.log('statusInternet', result);
		});

	} catch (error) {
		sentryCapture(`HuaweiModemAPI@_getModemStatusInternetHuawei ${JSON.stringify(error)}`, 'Gagal mendapatkan modem status internet');

		console.log('GET STATUS INTERNET', error.message);
		return false;
	}
};

export const _postModemLogoutHuawei = async (modemIP) => {
	return new Promise(async (resolve, _reject) => {
		const url = `http://${modemIP}/api/user/logout`;

		const body = {
			Logout: 1
		};

		const builder = new xml2js.Builder();
		const buildXml = builder.buildObject({ request: body });

		try {
			const result = await Axios.post(url, buildXml);
			parseString(result.data, function (_, result) {
				console.log('logout', result);
				resolve(true);
			});

		} catch (error) {
			console.log('HuaweiModemAPI@_postModemLogoutHuawei', error);
			resolve(false);
		}
	});
};

export const _postModemLoginHuawei = async (modemIP = false, user = false, pass = false, isPairing = false) => {
	return new Promise(async (resolve, _reject) => {
		try {
			const { modemData, globalData } = store.getState();

			if (!modemData) {
				return resolve(false);
			}

			modemIP = modemIP ? modemIP : globalData.modemIP;
			user = user ? user : globalData.modemUsername;
			pass = pass ? pass : modemData.attributes.passwordRouter;
		
			const loginStatus = await _getModemLoginStatusHuawei(modemIP, false);
			console.log('loginStatus@_postModemLoginHuawei', loginStatus);

			if (loginStatus === '0') {
				console.log('User Logged In');
				return resolve(true);
			}

			if(isPairing) {
				await CookieManager.clearAll();
			}

			const resultGetSession = await _getModemSessionHuawei(modemIP, true);

			if (!resultGetSession) {
				return resolve(false);
			}

			const { sesInfo, tokInfo } = resultGetSession;

			// start xml
			const body = {
				Username: user,
				Password: sha256andbase64(user, pass, tokInfo),
				password_type: 4
			};

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({ request: body });
			// end xml

			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			console.log('Options Login', options);

			const url = `http://${modemIP}/api/user/login`;

			const resultLogin = await Axios.post(url, buildXml, options);
			console.log('resultLogin', resultLogin);

			parseString(resultLogin.data, async function (err, result) {
				try {
					if (err) {
						return resolve(false);
					}

					if ('response' in result && result.response == 'OK') {
						console.log('Successful login to MODEM');
						return resolve(true);
					}

					if ('error' in result) {
						// sentryCapture(`HuaweiModemAPI@_postModemLoginHuawei ${JSON.stringify(result)}`, "Gagal login ke modem");
						if (result.error.code[0] == '125003') {
							await CookieManager.clearAll(); // modem key in here

							return resolve(false);
						}

						resolve(result.error.code[0]);
					}
				} catch (error) {
					console.log('HuaweiModemAPI@_postModemLoginHuawei', error);
					resolve(false);
				}
			});
		} catch (error) {
			console.log('HuaweiModemAPI@_postModemLoginHuawei', error);
			resolve(false);
		}
	});
};

export const _getModemListConnectedHuawei = async (modemIP = '192.168.8.1') => {
	return new Promise(async (resolve, _reject) => {
		try {
			// await _postModemLoginHuawei();
			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};
			const url = `http://${modemIP}/api/lan/HostInfo`;
			const result = await AxiosAdapter.get(url, options);
			console.log('result@_getModemListConnectedHuawei', result);

			parseString(result.data, (err, resultParse) => {
				if (err) {
					return resolve(false);
				}

				resolve(resultParse?.response?.Hosts[0].Host);
			});
		} catch (error) {
			console.log('error@_getModemListConnectedHuawei', error);
			resolve(false);
		}
	});
};

export const _getModemListBlockedHuawei = async (modemIP = '192.168.8.1') => {
	return new Promise(async (resolve, _reject) => {
		try {
			// await _postModemLoginHuawei();
			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};
			const url = `http://${modemIP}/api/wlan/multi-macfilter-settings-ex`;
			const result = await AxiosAdapter.get(url, options);

			parseString(result.data, (_err, result) => {
				resolve(result);
			});
		} catch (error) {
			resolve(false);
		}
	});
};

export const _postBlockDeviceHuawei = async (modemIP, _user, _pass, listDevice) => {
	// const resultLogin = await _postModemLoginHuawei(modemIP, user, pass);
	// console.log("rEsultlogin", resultLogin);
	return new Promise(async (resolve, _reject) => {
		const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
		const options = {
			headers: {
				...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
				'__RequestVerificationToken': tokInfo
			}
		};
		const url = `http://${modemIP}/api/wlan/multi-macfilter-settings`;

		// start xml
		let body = {
			// WifiMacFilterMac0: macAddress,
			// wifihostname0: hostName,
			WifiMacFilterStatus: 2,
			Index: 0
		};

		console.log('listdevice', listDevice);

		listDevice.map((val, key) => {
			if (val.isBlocked) {
				body[`WifiMacFilterMac${key}`] = val.MACAddress;
				body[`wifihostname${key}`] = val.HostName;
			}
		});

		console.log('body', body);

		const builder = new xml2js.Builder();
		const buildXml = builder.buildObject({ request: { Ssids: { Ssid: body } } });
		// end xml

		console.log('buildXML', buildXml);

		const result = await Axios.post(url, buildXml, options);

		parseString(result.data, (_err, result) => {
			try {
				resolve(result);
				return;
			} catch (error) {
				resolve(false);
				// console.log("Response", result);
				console.log('HuaweiModemAPI@_postBlockDeviceHuawei', error);
				return;
			}
		});
	});
};

export const _postRebootModemHuawei = (modemIP) => {
	// console.log("rEsultlogin", resultLogin);
	return new Promise(async (resolve, _reject) => {
		try {
			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP, true);
			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};
			const url = `http://${modemIP}/api/device/control`;

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({
				request: {
					Control: 1
				}
			});

			console.log('==== URL ======', url, buildXml, options);

			const result = await Axios.post(url, buildXml, options);

			parseString(result.data, (_err, result) => {
				try {
					resolve(result);
					return;
				} catch (error) {
					console.log('HuaweiModemAPI@_postRebootModemHuawei', error);
					resolve(false);
					// console.log("Response", result);
					return;
				}
			});

		} catch (error) {
			console.log('HuaweiModemAPI@_postRebootModemHuawei', error);
			resolve(false);
		}
	});
};

export const _getSessionForTimeRuleHuawei = async (modemIP) => {
	console.log('-----SESSION------');

	try {
		const url = `http://${modemIP}/api/webserver/SesTokInfo`;
		console.log('---------SESSION_TIME_RULE----------', url);
		const result = await AxiosAdapter.get(url);

		let data = {};
		parseString(result.data, (_err, result) => {
			data = { sesInfo: result.response.SesInfo[0], tokInfo: result.response.TokInfo[0] };
		});

		return data;
	} catch (e) {
		console.log('---------SESSION_FAILED----------', e);
	}
};

export const _postTimeRuleHuawei = (modemIP, dataConfig) => {
	return new Promise(async (resolve, _reject) => {
		await _postModemLoginHuawei();
		const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

		try {
			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			let body = {
				Action: dataConfig.isDelete ? 'delete' : dataConfig.isUpdate ? 'update' : 'create',
				EndTime: dataConfig.endTime,
				TimeMode: 1,
				DevicesNames: {
					DevicesName: dataConfig.devicesName
				},
				ID: dataConfig.isUpdate ? dataConfig.idTimeRule : null,
				StartTime: dataConfig.startTime,
				WeekEnable: dataConfig.weekEnable,
				DevicesMACs: {
					DevicesMAC: dataConfig.devicesMac
				},
				Enable: dataConfig.enable ? 1 : 0
			};

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({ request: { TimeControlRules: { TimeControlRule: body } } });

			console.log('buildXML', buildXml);

			const url = `http://${modemIP}/api/timerule/timerule`;
			console.log('TR_URL', url);

			const result = await Axios.post(url, buildXml, options);
			console.log('RES', result);

			let data = {};
			parseString(result.data, (_err, result) => {
				data = result;
				resolve(data);
			});
		} catch (err) {
			console.log('TR_ERR', err);
			resolve(false);
		}
	});
};

export const _getTimeRuleHuawei = (modemIP) => {
	return new Promise(async (resolve, _reject) => {
		const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

		try {
			const options = {
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'_ResponseSource': 'Browser',
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			const url = `http://${modemIP}/api/timerule/timerule`;

			const result = await AxiosAdapter.get(url, options);

			let data = {};
			parseString(result.data, (_err, result) => {
				data = result;
				resolve(data);
			});

			console.log('GET_TIME_RULE_RESULT', data);
		} catch (err) {
			console.log('GET_TIME_RULE_ERR', err);
			resolve(false);
		}
	});
};

export const _postTimeLimitHuawei = async (modemIP, endTime, devicesName, startTime, weekEnable, devicesMac) => {
	return new Promise(async (resolve, _reject) => {
		try {
			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

			let options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};
			console.log('Modem Session ', sesInfo, tokInfo);

			let body = {
				Action: 'create',
				EndTime: endTime,
				TimeMode: 1,
				Enable: 1,
				DevicesNames: {
					DevicesName: devicesName
				},
				ID: null,
				StartTime: startTime,
				WeekEnable: weekEnable,
				DevicesMACs: {
					DevicesMAC: devicesMac
				}
			};

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({ request: { TimeControlRules: { TimeControlRule: body } } });

			console.log('buildXML', buildXml);

			const url = `http://${modemIP}/api/timerule/timerule`;
			console.log('TR_URL', url);

			const result = await Axios.post(url, buildXml, options);
			console.log('RES', result);

			let data = {};
			parseString(result.data, (_err, result) => {
				data = result;
				resolve(data);
			});

		} catch (error) {
			console.log('TR_ERR', error);
			resolve(false);
		}
	});
};

export const _getPublicKey = (modemIP) => {
	return new Promise(async (resolve, _reject) => {
		try {
			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

			let options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			const url = `http://${modemIP}/api/webserver/publickey`;

			const result = await AxiosAdapter.get(url, options);
			console.log('_getPublicKey result', result);

			let data = {};
			parseString(result.data, (_err, result) => {
				console.log('_getPublicKey parseString', result);
				data = result;

				resolve(data);
			});
		} catch (err) {
			console.log('HuaweiModemAPI@_getPublicKey', err);
			resolve(false);
		}
	});
};

export const _getWifiMacAddressHuawei = (modemIP) => {
	return new Promise((resolve, _reject) => {
		setTimeout(async () => {

			try {
				const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

				let options = {
					headers: {
						...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
						'__RequestVerificationToken': tokInfo
					}
				};

				const url = `http://${modemIP}/api/wlan/multi-basic-settings`;
				const result = await AxiosAdapter.get(url, options);

				parseString(result.data, (_err, result) => {
					resolve(result.response.Ssids[0].Ssid[0].WifiMac[0]);
				});
			} catch (error) {
				resolve(false);
				console.log('HuaweiModemAPI@_getWifiMacAddressHuawei', error);
			}
		}, 5000);
	});
};

export const _postChangeSSIDPasswordHuawei = (modemIP, password, wifiSSID) => {
	return new Promise(async (resolve, _reject) => {
		const { modemData } = store.getState();
		const packageType = modemData?.attributes?.packageType;

		try {
			const pubKey = await _getPublicKey(modemIP);
			// console.log('pubKey', pubKey);

			const pEye = pubKey.response.encpubkeye[0];
			const pEyn = pubKey.response.encpubkeyn[0];

			const loginStatus = await _getModemLoginStatusHuawei(modemIP, true);
			const resultEnc = doRSAEncrypt(password, pEyn, pEye, loginStatus);
			// console.log('resultEnc', resultEnc);

			const resultWifiMacAddress = await _getWifiMacAddressHuawei(modemIP);
			if (!resultWifiMacAddress) {
				return resolve(true);
			}

			let body;

			if (packageType.includes('HUAWEI-5G-H122-373') || packageType.includes('HUAWEI-H122-373')) {
				body = [
					{
						WifiWep128Key2: null,
						Index: 0,
						WifiBroadcast: 0,
						wifiguestofftime: 4,
						WifiAuthmode: 'WPA2-PSK',
						ID: 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.1.',
						WifiEnable: 1,
						MixWifiWpapsk: resultEnc,
						wifiisguestnetwork: 0,
						WifiMac: resultWifiMacAddress,
						WifiWep128Key3: null,
						WifiSsid: wifiSSID,
						WifiWpapsk: resultEnc,
						WifiWep128Key4: null,
						WifiWep128Key1: null,
						WifiWpaencryptionmodes: 'AES',
						WifiWepKeyIndex: 1
					},
					{
						WifiWep128Key2: null,
						Index: 4,
						WifiBroadcast: 0,
						wifiguestofftime: 4,
						WifiAuthmode: 'WPA2-PSK',
						ID: 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.1.',
						WifiEnable: 1,
						MixWifiWpapsk: resultEnc,
						wifiisguestnetwork: 0,
						WifiMac: resultWifiMacAddress,
						WifiWep128Key3: null,
						WifiSsid: wifiSSID,
						WifiWpapsk: resultEnc,
						WifiWep128Key4: null,
						WifiWep128Key1: null,
						WifiWpaencryptionmodes: 'AES',
						WifiWepKeyIndex: 1
					}
				];
			} else if(packageType.includes('HUAWEI-B628-350')) {
				body = {
					wifiisguestnetwork: 0,
					wifiisdbhospecial: 0,
					wifisupportsecmodelist: 'OPEN WPA2 WPA-WPA2 WPA3 WPA2-WPA3',
					wifiguestofftime: 4,
					WifiBroadcast: 0,
					WifiAuthmode: 'WPA2-PSK',
					WifiWep128Key1: '',
					WifiWep128Key2: '',
					ID: 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.1.',
					WifiWep128Key4: '',
					WifiSsid: wifiSSID,
					WifiWpaencryptionmodes: 'AES',
					Index: 0,
					WifiEnable: 1,
					WifiWepKeyIndex: 1,
					MixWifiWpapsk: resultEnc,
					WifiWpapsk: resultEnc,
					WifiMac: resultWifiMacAddress,
					WifiWep128Key3: ''
				};
			} else {
				body = {
					WifiWep128Key2: null,
					Index: 0,
					WifiBroadcast: 0,
					wifiguestofftime: 4,
					WifiAuthmode: 'WPA2-PSK',
					ID: 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.1.',
					WifiEnable: 1,
					MixWifiWpapsk: resultEnc,
					wifiisguestnetwork: 0,
					WifiMac: resultWifiMacAddress,
					WifiWep128Key3: null,
					WifiSsid: wifiSSID,
					WifiWpapsk: resultEnc,
					WifiWep128Key4: null,
					WifiWep128Key1: null,
					WifiWpaencryptionmodes: 'AES',
					WifiWepKeyIndex: 1
				};
			}

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({ request: { Ssids: { Ssid: body }, WifiRestart: 1 } });

			console.log('buildXML', buildXml);

			const url = `http://${modemIP}/api/wlan/multi-basic-settings`;

			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
			
			let options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': sesInfo },
					'__RequestVerificationToken': tokInfo
				}
			};
			console.log('options', options);

			const resultChangeSSID = await Axios.post(url, buildXml, options);
			console.log('RES Change SSID ==> ', resultChangeSSID);

			parseString(resultChangeSSID.data, (_, result) => {
				resolve(result);
			});
		} catch (error) {
			console.log('HuaweiModemAPI@_postChangeSSIDPasswordHuawei', error);

			if (packageType.includes('HUAWEI-B628-350') && error.message.includes('Network Error')) {
				resolve({
					response: 'OK',
					isNetworkError: true
				});
			} else {
				resolve(false);
			}
		}

	});
};

export const _postChangeAdminPasswordHuawei = (modemIP, user = 'admin', newPass = 'admin', oldPass = 'admin') => {
	return new Promise(async (resolve, _reject) => {
		try {
			const { modemData } = store.getState();
			const packageType = modemData?.attributes?.packageType;

			const resultLogin  = await _postModemLoginHuawei(modemIP, user, oldPass, true);
			console.log('resultLogin@_postChangeAdminPasswordHuawei', resultLogin);

			const result = await _getModemSessionHuawei(modemIP, true);

			if (!result) {
				return resolve(false);
			}

			const { sesInfo, tokInfo } = result;

			const isModemNewEndpoint = packageType.includes('HUAWEI-B628-350') || packageType.includes('HUAWEI-B535-933') || packageType.includes('HUAWEI-5G-H122-373');

			// start xml
			let body = {};

			if (isModemNewEndpoint) {
				body = {
					Username: user,
					CurrentPassword: sha256andbase64(user, oldPass, tokInfo),
					NewPassword: base64newPassword(newPass),
					encryption_enable: 1
				};
			} else {
				body = {
					username: user,
					currentpassword: oldPass,
					newpassword: newPass
				};
			}

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({ request: body });
			// end xml

			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			const url = isModemNewEndpoint ? `http://${modemIP}/api/user/password` : `http://${modemIP}/api/user/password_scram`;

			// console.log('password_scram >>>', url, options, buildXml);

			const resultChangePassword = await Axios.post(url, buildXml, options);

			parseString(resultChangePassword.data, function (err, _result) {
				if (err) {
					return resolve(false);
				}

				resolve(_result);
			});
		} catch (error) {
			console.log('HuaweiModemAPI@_postChangeAdminPasswordHuawei', error);
			resolve(false);
		}
	});
};

export const _getModemNetInfoHuawei = (modemIP) => {
	return new Promise(async (resolve, _reject) => {
		try {
			const url = `http://${modemIP}/api/net/net-mode`;
			const result = await AxiosAdapter.get(url);

			let data = {};
			parseString(result.data, (_err, result) => {
				data = result;
				resolve(data);
			});
		} catch (error) {
			resolve(false);
		}
	});
};

export const _postUnlock4GModemHuawei = (modemIP, user, pass) => {
	return new Promise(async (resolve, _reject) => {
		try {
			await CookieManager.clearAll(); // modem key in here
			await _postModemLoginHuawei(modemIP, user, pass);

			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

			let options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			let body = {
				NetworkMode: '03',
				NetworkBand: '00680380',
				LTEBand: '7FFFFFFFFFFFFFFF'
			};

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({ request: body });
			const url = `http://${modemIP}/api/net/net-mode`;
			const result = await Axios.post(url, buildXml, options);

			console.log('RES', result);

			let data = {};
			parseString(result.data, (_err, result) => {
				data = result;
				resolve(data);
			});

		} catch (error) {
			sentryCapture(`HuaweiModemAPI@_postUnlock4GModemHuawei ${JSON.stringify(error)}`, 'Gagal unlock modem');
			console.log('HuaweiModemAPI@_postUnlock4GModemHuawei', error);
			resolve(false);
		}
	});
};

export const _postUrlFilteringHuawei = async (modemIP, filteringArray) => {
	return new Promise(async (resolve, _reject) => {
		const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
		const options = {
			headers: {
				...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
				'__RequestVerificationToken': tokInfo
			}
		};
		const url = `http://${modemIP}/api/security/url-filter`;

		// start xml

		let urlfilter = [];

		filteringArray.map((val, _key) => {
			let data = {
				value: val.url,
				status: 1
			};
			urlfilter.push(data);
		});

		// console.log("urlfilters", urlfilter);

		const body = {
			'urlfilters': {
				'urlfilter': urlfilter
			}
		};

		const builder = new xml2js.Builder();
		const buildXml = builder.buildObject({ request: body });
		// end xml

		// console.log("buildXML", buildXml);

		const result = await Axios.post(url, buildXml, options);

		parseString(result.data, (_err, result) => {
			try {
				resolve(result);
				return;
			} catch (error) {
				resolve(false);
				// console.log("Response", result);
				console.log('_postUrlFilteringHuawei', error);
				return;
			}
		});
	});
};

export const _getUrlFilteringHuawei = async (modemIP) => {
	return new Promise(async (resolve, _reject) => {
		const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
		const options = {
			headers: {
				...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
				'__RequestVerificationToken': tokInfo
			}
		};
		const url = `http://${modemIP}/api/security/url-filter`;
		const result = await Axios.get(url, options);

		parseString(result.data, (_err, result) => {
			try {
				resolve(result);
				return;
			} catch (error) {
				resolve(false);
				// console.log("Response", result);
				console.log('_getUrlFilteringHuawei', error);
				return;
			}
		});
	});
};

export const _getHeartBeatHuawei = (modemIP) => {
	return new Promise(async (resolve, _reject) => {
		try {
			const url = `http://${modemIP}/api/user/heartbeat`;
			const result = await AxiosAdapter.get(url, { timeout: 300 });

			let data = {};
			parseString(result.data, (_err, result) => {
				data = result;
				resolve(data);
			});
		} catch (error) {
			resolve(false);
		}
	});
};

export const _getDeviceInformationHuawei = (modemIP = '192.168.8.1') => {
	return new Promise(async (resolve, _reject) => {
		try {
			await _postModemLoginHuawei();

			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
			// console.log('_getDeviceInformationHuawei sesInfo', sesInfo)
			// console.log('_getDeviceInformationHuawei tokInfo', tokInfo)
			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			AxiosAdapter.get(`http://${modemIP}/api/device/information`,
				options
			)
				.then(function (response) {
					console.log('step 3');
					const responses = response.data;
					// console.log('_getDeviceInformationHuawei RESPONSE xml', response)

					var xml = responses;
					parseString(xml, function (_err, result) {
						const result2 = result;
						console.log('_getDeviceInformationHuawei RESPONSE json', result2);
						resolve(result2);
					});
				})
				.catch(function (error) {
					console.log('HuaweiModemAPI@_getDeviceInformationHuawei', error);
					resolve(false);
				});
		} catch (error) {
			resolve(false);
		}
	});
};

export const _getGuestSSIDTimeHuawei = async (modemIP) => {
	return new Promise(async (resolve, _reject) => {
		const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

		try {
			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			const url = `http://${modemIP}/api/wlan/guesttime-setting`;
			const result = await AxiosAdapter.get(url, options);

			let data = {};
			parseString(result.data, (_err, result) => {
				data = result.response;
				resolve(result.response);
			});

			console.log('HuaweiModemAPI@_getGuestSSIDTimeHuawei_RESULT', data);
		} catch (err) {
			console.log('HuaweiModemAPI@_getGuestSSIDTimeHuawei_ERR', err);
			resolve(false);
		}
	});
};

export const _addGuestSSIDTimeHuawei = async (modemIP, extendTime) => {
	return new Promise(async (resolve, _reject) => {
		const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

		try {
			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			const body = {
				extendtime: extendTime
			};

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({ request: body });

			const url = `http://${modemIP}/api/wlan/guesttime-setting`;
			const result = await Axios.post(url, buildXml, options);

			let data = {};
			parseString(result.data, (_err, result) => {
				data = result.response;
				resolve(result);
			});

			console.log('HuaweiModemAPI@_addGuestSSIDTimeHuawei_RESULT', data);
		} catch (err) {
			console.log('HuaweiModemAPI@_addGuestSSIDTimeHuawei_ERR', err);
			resolve(false);
		}
	});
};

export const _getGuestSSIDStatusHuawei = (modemIP, deviceType) => {
	return new Promise((resolve, _reject) => {
		setTimeout(async () => {
			try {
				const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

				let options = {
					headers: {
						...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
						'__RequestVerificationToken': tokInfo
					}
				};

				const url = `http://${modemIP}/api/wlan/multi-basic-settings`;
				const result = await AxiosAdapter.get(url, options);

				parseString(result.data, (err, resultJSON) => {
					console.log('HuaweiModemAPI@_getGuestSSIDStatusHuawei_RESULT', resultJSON);

					if (err) {
						resolve(false);
					}

					let dataJson = resultJSON.response;
					const indexSsid = deviceType.includes('HUAWEI-B311As-853') || deviceType.includes('HUAWEI-B312-926') ? 1 : 2;

					resolve(dataJson?.Ssids[0].Ssid[indexSsid]);
				});
			} catch (error) {
				resolve(false);
				console.log('HuaweiModemAPI@_getGuestSSIDStatusHuawei_ERR', error);
			}
		}, 4000);
	});
};

export const _activateGuestSSIDHuawei = async (modemIP, status, guestSsidData, deviceType) => {
	return new Promise(async (resolve, _reject) => {
		try {
			const resultWifiMacAddress = await _getWifiMacAddressHuawei(modemIP);
			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);
			const guestOfftime = guestSsidData.wifiDuration;
			const wifiMacGuest = guestSsidData.WifiMac;
			const isEncrypt = guestSsidData.isEncrypt;
			const indexSsid = deviceType.includes('HUAWEI-B311As-853') || deviceType.includes('HUAWEI-B312-926') ? 1 : 2;
			const idSsid = deviceType.includes('HUAWEI-B311As-853') || deviceType.includes('HUAWEI-B312-926') ? 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.2.' : 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.3.';
			
			if (!resultWifiMacAddress) {
				resolve(true);
				return;
			}

			const body = [
				{
					Index: 0,
					WifiAuthmode: 'WPA/WPA2-PSK',
					WifiWepKeyIndex: 1,
					WifiWpaencryptionmodes: 'AES',
					WifiBroadcast: 0,
					WifiMac: resultWifiMacAddress,
					wifiisguestnetwork: '0',
					wifiguestofftime: guestOfftime,
					ID: 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.1.',
					wifisupportsecmodelist: '',
					WifiEnable: 1
				},
				{
					Index: indexSsid,
					WifiAuthmode: 'WPA/WPA2-PSK',
					WifiWepKeyIndex: 1,
					WifiWpaencryptionmodes: 'AES',
					WifiBroadcast: 0,
					WifiMac: wifiMacGuest,
					wifiisguestnetwork: 1,
					wifiguestofftime: guestOfftime,
					ID: idSsid,
					wifisupportsecmodelist: '',
					WifiEnable: status
				}
			];

			const bodyOpen = [
				{
					Index: 0,
					WifiAuthmode: 'WPA/WPA2-PSK',
					WifiWepKeyIndex: 1,
					WifiWpaencryptionmodes: 'AES',
					WifiBroadcast: 0,
					WifiMac: resultWifiMacAddress,
					wifiisguestnetwork: '0',
					wifiguestofftime: guestOfftime,
					ID: 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.1.',
					wifisupportsecmodelist: '',
					WifiEnable: 1
				},
				{
					Index: indexSsid,
					WifiAuthmode: 'OPEN',
					WifiWepKeyIndex: 1,
					WifiBasicencryptionmodes: 'NONE',
					WifiBroadcast: 0,
					WifiMac: wifiMacGuest,
					wifiisguestnetwork: 1,
					wifiguestofftime: guestOfftime,
					ID: idSsid,
					wifisupportsecmodelist: '',
					WifiEnable: status
				}
			];

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({
				request: {
					Ssids: { Ssid: isEncrypt ? body : bodyOpen },
					WifiRestart: 1,
					modify_guest_ssid: 1
				}
			});
			// console.log("buildXML@_activateGuestSSIDHuawei", buildXml);

			const options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			const url = `http://${modemIP}/api/wlan/multi-basic-settings`;

			const result = await Axios.post(url, buildXml, options);
			console.log('HuaweiModemAPI@_activateGuestSSIDHuawei_RES_AWAIT', result);

			let data = {};
			parseString(result.data, (_err, result) => {
				data = result.response;
				resolve(result);
			});

			console.log('HuaweiModemAPI@_activateGuestSSIDHuawei_RESULT', data);
		} catch (err) {
			console.log('HuaweiModemAPI@_activateGuestSSIDHuawei_ERR', err);
			resolve(false);
		}
	});
};

export const _postChangeSSIDPasswordGuestHuawei = (modemIP, wifiName, password, wifiDuration, deviceType) => {
	return new Promise(async (resolve, _reject) => {
		try {
			const pubKey = await _getPublicKey(modemIP);

			const pEye = pubKey.response.encpubkeye[0];
			const pEyn = pubKey.response.encpubkeyn[0];
			// console.log('pubkey guest', pubKey);

			const loginStatus = await _getModemLoginStatusHuawei(modemIP, true);
			const resultEnc = doRSAEncrypt(password, pEyn, pEye, loginStatus);
			const { guestSsidData } = store.getState();
			const { wifiMac, isEncrypt } = guestSsidData;
			const indexSsid = deviceType.includes('HUAWEI-B311As-853') || deviceType.includes('HUAWEI-B312-926') ? 1 : 2;
			const idSsid = deviceType.includes('HUAWEI-B311As-853') || deviceType.includes('HUAWEI-B312-926') ? 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.2.' : 'InternetGatewayDevice.X_Config.Wifi.Radio.1.Ssid.3.';

			let body = {
				WifiWepKey4: '',
				WifiWep128Key1: '',
				WifiWepKey3: '',
				Index: indexSsid,
				WifiAuthmode: 'WPA/WPA2-PSK',
				WifiWepKeyIndex: 1,
				WifiWpaencryptionmodes: 'MIX',
				WifiBroadcast: 0,
				WifiWepKey2: '',
				WifiWep128Key3: '',
				WifiWepKey1: '',
				MixWifiWpapsk: resultEnc,
				WifiWpapsk: resultEnc,
				WifiMac: wifiMac,
				WifiSsid: wifiName,
				wifiisguestnetwork: 1,
				wifiguestofftime: wifiDuration,
				WifiWep128Key4: '',
				ID: idSsid,
				WifiRadiusKey: '',
				wifisupportsecmodelist: '',
				WifiEnable: 1,
				WifiWep128Key2: ''
			};

			let bodyOpen = {
				WifiWepKey4: null,
				WifiWep128Key1: null,
				WifiWepKey3: null,
				Index: indexSsid,
				WifiAuthmode: 'OPEN',
				WifiWepKeyIndex: 1,
				WifiBroadcast: 0,
				WifiWepKey2: null,
				WifiWep128Key3: null,
				WifiWepKey1: null,
				WifiMac: wifiMac,
				WifiSsid: wifiName,
				wifiisguestnetwork: 1,
				wifiguestofftime: wifiDuration,
				WifiWep128Key4: null,
				ID: idSsid,
				WifiRadiusKey: null,
				wifisupportsecmodelist: null,
				WifiEnable: 1,
				WifiWep128Key2: null,
				WifiBasicencryptionmodes: 'NONE'
			};

			const builder = new xml2js.Builder();
			const buildXml = builder.buildObject({
				request: {
					Ssids: { Ssid: isEncrypt ? body : bodyOpen },
					WifiRestart: 1,
					modify_guest_ssid: 1
				}
			});

			const url = `http://${modemIP}/api/wlan/multi-basic-settings`;
			const { sesInfo, tokInfo } = await _getModemSessionHuawei(modemIP);

			let options = {
				headers: {
					...Platform.OS == 'android' && { 'Cookie': `${sesInfo}` },
					'__RequestVerificationToken': tokInfo
				}
			};

			const result = await Axios.post(url, buildXml, options);
			console.log('result post change guest ssid ', result);

			let data = {};
			parseString(result.data, (_err, resultParse) => {
				data = resultParse;
				resolve(data);
			});
		} catch (error) {
			console.log('HuaweiModemAPI@_postChangeSSIDPasswordGuestHuawei', error);
			resolve(false);
		}
	});
};
