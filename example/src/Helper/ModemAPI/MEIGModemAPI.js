import CryptoJS from 'crypto-js';
import { RNFetchBlobAdapter } from '../../Config/RNFetchBlobAdapter';
import { store } from '../../Config/Store';
import { wifiGetSSIDCurrent } from '../ModemLibrary';

const baseUrl = 'https://192.168.8.1/';

export const errorCodes = {
	'0': 'success',
	'100': 'wrong format',
	'101': 'not found',
	'102': 'Parameter error',
	'103': 'execution error',
	'104': 'Process is busy',
	'105': 'not support',
	'106': 'Out of range',
	'107': 'out of buffer',
	'108': 'memory allocation error',
	'109': 'Interprocess communication error',
	'120': 'Upgrade status busy',
	'200': 'username error',
	'201': 'wrong password',
	'202': 'current username has logged in',
	'210': 'not logged in',
	'211': 'wrong old password',
	'212': 'wrong new password',
	'213': 'Confirm password error',
	'214': 'wrong new username',
	'215': 'wrong old username',
	'216': 'Same as old and new username',
	'217': 'Same as Old and new password'
};

const _encryptHMACMD5 = (val) => {
	const key = '0123456789';
	const encryptedVal = CryptoJS.HmacMD5(val, key).toString();

	return encryptedVal;
};

const _getHeadersRequest = (ref) => {
	let refererPath = 'common/login.html';

	switch (ref) {
		case 'login':
			refererPath = 'common/login.html';
			break;

		case 'home':
			refererPath = 'common/home.html';
			break;

		case 'setting':
			refererPath = 'html/settings.html';
			break;

		default:
			break;
	}

	return {
		'Accept': 'application/json, text/javascript',
		'Content-Type': 'application/json',
		'Host': '192.168.8.1',
		'Origin': 'https://192.168.8.1',
		'Referer': `https://192.168.8.1/${refererPath}`
	};
};



export const _getModemLoginStatusMEIG = async () => {
	return new Promise(async (resolve, _reject) => {
		try {
			const url = `${baseUrl}goform/get_login_info`;
			const headers = _getHeadersRequest('login');
			const payload = {};

			const result = await RNFetchBlobAdapter.post(url, headers, JSON.stringify(payload));
			const resultData = JSON.parse(result?.data);

			if (resultData?.retcode === 0) {
				resolve({
					isLogin: resultData?.loginStatus === 1,
					statusLogin: resultData?.loginStatus,
					statusCode: resultData?.retcode
				});
			} else {
				resolve({
					isLogin: false,
					statusLogin: resultData?.loginStatus,
					statusCode: resultData?.retcode
				});
			}
		} catch (error) {
			console.log('MEIGModemAPI@_postModemLoginStatusMEIG', error);
			resolve(false);
		}
	});
};

export const _postModemLoginMEIG = async (username = 'admin', password = 'admin') => {
	return new Promise(async (resolve, _reject) => {
		try {
			const getLoginStatus = await _getModemLoginStatusMEIG();
			const isLogin = getLoginStatus?.isLogin;
			console.log('isLogin', isLogin);

			if (isLogin) {
				resolve({
					isLogin: true,
					statusCode: 0
				});
			} else {
				const url = `${baseUrl}goform/login`;
				const headers = _getHeadersRequest('login');
				const payload = {
					username: _encryptHMACMD5(username),
					password: _encryptHMACMD5(password)
				};

				const result = await RNFetchBlobAdapter.post(url, headers, JSON.stringify(payload));
				const resultData = JSON.parse(result?.data);

				const resultResponse = {
					isLogin: resultData?.retcode === 0,
					statusCode: resultData?.retcode
				};

				resolve(resultResponse);
			}
		} catch (error) {
			console.log('MEIGModemAPI@_postModemLoginMEIG', error);
			resolve(false);
		}
	});
};

export const _postChangeAdminPasswordMEIG = async (oldPassword, newPassword) => {
	return new Promise(async (resolve, _reject) => {
		try {
			const resultLogin = await _postModemLoginMEIG('admin', oldPassword);
			if (!resultLogin?.isLogin) {
				return resolve(false);
			}

			const url = `${baseUrl}action/modify_password`;
			const headers = _getHeadersRequest('home');
			const payload = {
				o_passwd: _encryptHMACMD5(oldPassword),
				n_passwd: _encryptHMACMD5(newPassword),
				c_passwd: _encryptHMACMD5(newPassword)
			};

			const result = await RNFetchBlobAdapter.post(url, headers, JSON.stringify(payload));
			console.log('result@_postChangeAdminPasswordMEIG', result?.data);
			const resultData = JSON.parse(result?.data);

			resolve({
				isSuccessPairing: resultData?.retcode === 0,
				statusCode: resultData?.retcode
			});
		} catch (error) {
			console.log('MEIGModemAPI@_postChangeAdminPasswordMEIG', error);
			resolve(false);
		}
	});
};

export const _getModemListConnectedMEIG = async (username = 'admin', password = 'admin') => {
	return new Promise(async (resolve, _reject) => {
		try {
			await _postModemLoginMEIG(username, password);

			const url = `${baseUrl}action/router_get_hosts_info`;
			const headers = _getHeadersRequest('home');
			const payload = {};

			const result = await RNFetchBlobAdapter.post(url, headers, JSON.stringify(payload));
			const resultData = JSON.parse(result?.data);

			if (resultData?.retcode === 0) {
				resolve(resultData?.data?.rt_hosts_list);
			} else {
				resolve(false);
			}
		} catch (error) {
			console.log('MEIGModemAPI@_getModemListConnectedMEIG', error);
			resolve(false);
		}
	});
};

export const _postChangeSSIDPasswordMEIG = async (wifiName, wifiPassword) => {
	return new Promise(async (resolve, _reject) => {
		try {
			const { modemData, globalData } = store.getState();
			const username = globalData?.modemUsername;
			const password = modemData?.attributes?.passwordRouter;

			await _postModemLoginMEIG(username, password);

			const url = `${baseUrl}action/wifi_set_basic_params`;
			const headers = _getHeadersRequest('setting');
			const payload = {
				wifi_ssid_0: wifiName,
				wifi_psk_0: wifiPassword,
				wifi_state_0: 'ap_enable',
				wifi_security_0: 'wpa_wpa2',
				wifi_broadcast_ssid_0: 'visible'
			};

			const result = await RNFetchBlobAdapter.post(url, headers, JSON.stringify(payload));
			const resultData = JSON.parse(result?.data);
			console.log('resultData', resultData);

			resolve({
				isSuccess: resultData?.retcode === 0,
				statusCode: resultData?.retcode,
				message: resultData?.retcode === 0 ? 'Change SSID Name or Password Success' : 'Change SSID Name or Password Failed'
			});
		} catch (error) {
			console.log('error@_postChangeSSIDPasswordMEIG', error);

			setTimeout(() => {
				wifiGetSSIDCurrent().then((currentSSID) => {
					console.log('currentSSID', currentSSID);

					if(currentSSID !== wifiName) {
						resolve({
							isSuccess: true,
							message: 'Change SSID Name or Password success, but failed to get response because disconnected from wifi',
							isNetworkError: true
						});
					} else {
						resolve({
							isSuccess: false,
							message: 'Change SSID Name or Password failed, throw error'
						});
					}
				});
			}, 5000);
		}
	});
};


