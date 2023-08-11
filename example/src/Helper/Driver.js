import { store } from '../Config/Store';
import { 
	_getHeartBeatHuawei, 
	_getModemLoginStatusHuawei,
	_postModemLoginHuawei,
	_postModemLogoutHuawei,
	_postChangeAdminPasswordHuawei,
	_getModemSessionHuawei,
	_getModemIsConnectedToInternetHuawei,
	_getDeviceInformationHuawei,
	_postUnlock4GModemHuawei,
	_getModemListConnectedHuawei,
	_getModemListBlockedHuawei,
	_postBlockDeviceHuawei,
	_postRebootModemHuawei,
	_getSessionForTimeRuleHuawei,
	_postTimeRuleHuawei,
	_getTimeRuleHuawei,
	_postTimeLimitHuawei,
	_getWifiMacAddressHuawei,
	_postChangeSSIDPasswordHuawei,
	_postUrlFilteringHuawei,
	_getUrlFilteringHuawei,
	_getGuestSSIDTimeHuawei,
	_addGuestSSIDTimeHuawei,
	_getGuestSSIDStatusHuawei,
	_activateGuestSSIDHuawei,
	_postChangeSSIDPasswordGuestHuawei
} from './ModemAPI/HuaweiModemAPI';
import { 
	_getHeartBeatNotion,
	_getModemLoginStatusNotion,
	_postModemLoginNotion,
	_postModemLogoutNotion,
	_postChangeAdminPasswordNotion,
	_getDeviceInformationNotion,
	_getModemListConnectedNotion,
	_postChangeSSIDPasswordNotion,
	_postBlockDeviceNotion,
	_getTimeRuleNotion,
	_postTimeLimiNotion,
	_postTimeRuleNotion,
	_getGuestSSIDStatusNotion,
	_activateGuestSSIDNotion,
	_postChangeSSIDPasswordGuestNotion,
	_getUrlFilteringNotion,
	_postUrlFilteringNotion,
	_postEditUrlFilteringNotion,
	_postDeleteUrlFilteringNotion,
	_postDisableUrlFilteringNotion,
	_getDisableEnableUrlFilterNotion
} from './ModemAPI/NotionModemAPI';
import {
	_getDeviceInformationZTE,
	_getHeartBeatZTE,
	_getModemListConnectedZTE,
	_getModemLoginStatusZTE,
	_getModemSsidNameZTE,
	_postChangeAdminPasswordZTE,
	_postChangeSSIDPasswordZTE,
	_postModemLoginZTE,
	_postModemLogoutZTE,
	_postModemLoginNewZTE,
	// _postModemLoginZTE5G,
	// _postModemLoginZTEMF293N,
	_postBlockDeviceZTE,
	_postTimeRuleZTE,
	_getGuestSSIDStatusZTE,
	_postChangeSSIDPasswordGuestZTE,
	_activateGuestSSIDZTE,
	_postUrlFilteringZTE,
	_postDisableUrlFilteringZTE,
	_postDeleteUrlFilteringZTE,
	_getUrlFilterListZTE,
	_postTimeLimitZTE,
	_postAddDeviceToParental,
	_getModemListBlockedZTE,
	_getUserParental,
	_getDeviceItSelf,
	_getTimeRule
} from './ModemAPI/ZTEModemAPI';
import {
	_getHeartBeatAdvan,
	_postModemLoginAdvan,
	_postChangeAdminPasswordAdvan,
	_getModemLoginStatusAdvan,
	_getDeviceInformationAdvan,
	_getModemListConnectedAdvan,
	_postChangeSSIDPasswordAdvan,
	_getGuestSSIDStatusAdvan,
	_postChangeSSIDPasswordGuestAdvan,
	_activateGuestSSIDAdvan,
	_getUrlFilterListAdvan,
	_postUrlFilteringAdvan,
	_postDeleteUrlFilteringAdvan,
	_postDisableUrlFilteringAdvan,
	_postBlockDeviceAdvan,
	_getModemListBlockedAdvan,
	_postTimeLimitAdvan,
	_getTimeRuleAdvan,
	_getDeviceItSelfAdvan
} from './ModemAPI/AdvanModemAPI';
import {
	_getModemLoginStatusMEIG,
	_postModemLoginMEIG,
	_postChangeAdminPasswordMEIG,
	_getModemListConnectedMEIG,
	_postChangeSSIDPasswordMEIG
} from './ModemAPI/MEIGModemAPI';

const HUAWEI = 'HUAWEI';
const NOTION = 'NOTION';
const ZTE = 'ZTE';
const ADVAN = 'ADVAN';
const MEIG = 'MEIG';

const modemIP = '192.168.8.1';

export const getModemFirmwareVersion = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getDeviceInformationHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(false);
			} else if (modemType == ADVAN) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getModemLoginStatus = (isResult) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getModemLoginStatusHuawei(modemIP, isResult));
			} else if (modemType == NOTION) {
				resolve(_getModemLoginStatusNotion(modemIP));
			} else if (modemType == ZTE) {
				resolve(_getModemLoginStatusZTE(modemIP));
			} else if (modemType == ADVAN) {
				resolve(_getModemLoginStatusAdvan(modemIP));
			} else if (modemType == MEIG) {
				resolve(_getModemLoginStatusMEIG());
			} else {
				resolve(false);
			}
		} catch (error) {
			console.log('Driver.js@getModemLoginStatus', error.message);
			resolve(false);
		}
	});
};

export const getModemSession = async (modemIP = '192.168.8.1', isPairing = false) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getModemSessionHuawei(modemIP, isPairing));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(false);
			} else if (modemType == ADVAN) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postModemLogout = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_postModemLogoutHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(_postModemLogoutNotion(modemIP));
			} else if (modemType == ZTE) {
				resolve(_postModemLogoutZTE(modemIP));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postModemLogin = async (user = false, pass = false) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType, modemData } = store.getState();
			const packageType = modemData.attributes.packageType;

			if (modemType == HUAWEI) {
				resolve(_postModemLoginHuawei(modemIP, user, pass));
			} else if (modemType == NOTION) {
				resolve(_postModemLoginNotion(modemIP, user, pass));
			} else if (modemType == ZTE) {
				let isLoginNew = false;
				const packageTypeUpper = packageType.toUpperCase();

				if (packageTypeUpper.includes('ZTE-5G-MC801A') || packageTypeUpper.includes('ZTE-MF293N') || packageTypeUpper.includes('ZTE-MF283U')) {
					isLoginNew = true;
				}

				if (isLoginNew) {
					resolve(_postModemLoginNewZTE(modemIP, packageType));
				} else {
					resolve(_postModemLoginZTE(modemIP, user, pass));
				}
			} else if (modemType == ADVAN) {
				resolve(_postModemLoginAdvan(modemIP, user, pass));
			} else if (modemType == MEIG) {
				resolve(_postModemLoginMEIG(user, pass));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postChangeAdminPassword = async (user = 'admin', newPass = 'admin', oldPass = 'admin') => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType, modemData } = store.getState();
			const packageType = modemData.attributes.packageType;

			if (modemType == HUAWEI) {
				resolve(_postChangeAdminPasswordHuawei(modemIP, user, newPass, oldPass));
			} else if (modemType == NOTION) {
				resolve(_postChangeAdminPasswordNotion(modemIP, user, newPass, oldPass));
			} else if (modemType == ZTE) {
				let isLoginNew = false;
				const packageTypeUpper = packageType.toUpperCase();

				if (packageTypeUpper.includes('ZTE-5G-MC801A') || packageTypeUpper.includes('ZTE-MF293N') || packageTypeUpper.includes('ZTE-MF283U')) {
					isLoginNew = true;
				}

				if (isLoginNew) {
					resolve(_postModemLoginNewZTE(modemIP, packageType));
				} else {
					resolve(_postChangeAdminPasswordZTE(modemIP, user, newPass, oldPass));
				}
			} else if (modemType == ADVAN) {
				resolve(_postChangeAdminPasswordAdvan(modemIP, user, newPass, oldPass));
			} else if (modemType == MEIG) {
				resolve(_postChangeAdminPasswordMEIG(oldPass, newPass));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getModemListConnected = async (username, password) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getModemListConnectedHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(_getModemListConnectedNotion(modemIP, username, password));
			} else if (modemType == ZTE) {
				resolve(_getModemListConnectedZTE(modemIP, username, password));
			} else if (modemType == ADVAN) {
				resolve(_getModemListConnectedAdvan(modemIP, username, password));
			} else if (modemType == MEIG) {
				resolve(_getModemListConnectedMEIG(username, password));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getModemListBlocked = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getModemListBlockedHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(_getModemListBlockedZTE(modemIP));
			} else if (modemType == ADVAN) {
				resolve(_getModemListBlockedAdvan(modemIP));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postBlockDevice = async (modemIP = '192.168.8.1', user, pass, listDevice) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_postBlockDeviceHuawei(modemIP, user, pass, listDevice));
			} else if (modemType == NOTION) {
				resolve(_postBlockDeviceNotion(modemIP, user, pass, listDevice));
			} else if (modemType == ZTE) {
				resolve(_postBlockDeviceZTE(modemIP, user, pass, listDevice));
			} else if (modemType == ADVAN) {
				resolve(_postBlockDeviceAdvan(modemIP, user, pass, listDevice));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getSessionForTimeRule = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getSessionForTimeRuleHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postTimeRule = (
		modemIP = '192.168.8.1', 
		endTime, 
		devicesName, 
		startTime, 
		weekEnable,
		devicesMac, 
		enable = true, 
		idTimeRule = false, 
		isUpdate = false, 
		isDelete = false, 
		indexValue) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();
			const dataConfig = {
				devicesName,
				startTime,
				endTime,
				weekEnable,
				devicesMac,
				enable,
				idTimeRule,
				isUpdate,
				isDelete,
				indexValue
			};

			if (modemType == HUAWEI) {
				resolve(_postTimeRuleHuawei(modemIP, dataConfig));
			} else if (modemType == NOTION) {
				resolve(_postTimeRuleNotion(modemIP, dataConfig));
			} else if (modemType == ZTE) {
				resolve(_postTimeRuleZTE(modemIP, dataConfig));
			} else if (modemType == ADVAN) {
				resolve(_postTimeLimitAdvan(modemIP, endTime, devicesName, startTime, weekEnable, devicesMac));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getTimeRule = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getTimeRuleHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(_getTimeRuleNotion(modemIP));
			} else if (modemType == ZTE) {
				resolve(_getTimeRule(modemIP));
			} else if (modemType == ADVAN) {
				resolve(_getTimeRuleAdvan(modemIP));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postTimeLimit = async (modemIP = '192.168.8.1', endTime, devicesName, startTime, weekEnable, devicesMac) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_postTimeLimitHuawei(modemIP, endTime, devicesName, startTime, weekEnable, devicesMac));
			} else if (modemType == NOTION) {
				resolve(_postTimeLimiNotion(modemIP, endTime, devicesName, startTime, weekEnable, devicesMac));
			} else if (modemType == ZTE) {
				resolve(_postTimeLimitZTE(modemIP, endTime, devicesName)); // devicesName means isDelete parameter on ZTE
			} else if (modemType == ADVAN) {
				resolve(_postTimeLimitAdvan(modemIP, endTime, devicesName, startTime, weekEnable, devicesMac));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postRebootModem = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_postRebootModemHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getWifiMacAddress = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getWifiMacAddressHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postChangeSSIDPassword = (wifiPassword, wifiName) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_postChangeSSIDPasswordHuawei(modemIP, wifiPassword, wifiName));
			} else if (modemType == NOTION) {
				resolve(_postChangeSSIDPasswordNotion(modemIP, wifiPassword, wifiName));
			} else if (modemType == ZTE) {
				resolve(_postChangeSSIDPasswordZTE(modemIP, wifiPassword, wifiName));
			} else if (modemType == ADVAN) {
				resolve(_postChangeSSIDPasswordAdvan(modemIP, wifiPassword, wifiName));
			} else if (modemType == MEIG) {
				resolve(_postChangeSSIDPasswordMEIG(wifiName, wifiPassword));
      } else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postUnlock4GModem = (modemIP = '192.168.8.1', user, pass) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_postUnlock4GModemHuawei(modemIP, user, pass));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postUrlFiltering = async (modemIP = '192.168.8.1', filteringArray) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_postUrlFilteringHuawei(modemIP, filteringArray));
			} else if (modemType == NOTION) {
				resolve(_postUrlFilteringNotion(modemIP, filteringArray));
			} else if (modemType == ZTE) {
				resolve(_postUrlFilteringZTE(modemIP, filteringArray));
			} else if (modemType == ADVAN) {
				resolve(_postUrlFilteringAdvan(modemIP, filteringArray));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postEditUrlFiltering = async (modemIP = '192.168.8.1', filteringArray, index, toogle) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(false);
			} else if (modemType == NOTION) {
				resolve(_postEditUrlFilteringNotion(modemIP, filteringArray, index, toogle));
			} else if (modemType == ZTE) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
}

export const postDeleteUrlFiltering = async (modemIP = '192.168.8.1', filteringArray, index) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(false);
			} else if (modemType == NOTION) {
				resolve(_postDeleteUrlFilteringNotion(modemIP, filteringArray, index));
			} else if (modemType == ZTE) {
				resolve(_postDeleteUrlFilteringZTE(modemIP, filteringArray));
			} else if (modemType == ADVAN) {
				resolve(_postDeleteUrlFilteringAdvan(modemIP, filteringArray));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
}

export const postDisableUrlFiltering = async (modemIP = '192.168.8.1', websiteFiltering) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(false);
			} else if (modemType == NOTION) {
				resolve(_postDisableUrlFilteringNotion(modemIP, websiteFiltering));
			} else if (modemType == ZTE) {
				resolve(_postDisableUrlFilteringZTE(modemIP, websiteFiltering));
			} else if (modemType == ADVAN) {
				resolve(_postDisableUrlFilteringAdvan(modemIP, websiteFiltering));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
}

export const getUrlFiltering = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getUrlFilteringHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(_getUrlFilteringNotion(modemIP));
			} else if (modemType == ZTE) {
				resolve(_getUrlFilterListZTE(modemIP));
			} else if (modemType == ADVAN) {
				resolve(_getUrlFilterListAdvan(modemIP));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getDisableEnableUrlFilter = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(false);
			} else if (modemType == NOTION) {
				resolve(_getDisableEnableUrlFilterNotion(modemIP));
			} else if (modemType == ZTE) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getHeartBeat = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getHeartBeatHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(_getHeartBeatNotion(modemIP));
			} else if (modemType == ZTE) {
				resolve(_getHeartBeatZTE(modemIP));
			} else if (modemType == ADVAN) {
				resolve(_getHeartBeatAdvan(modemIP));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getDeviceInformation = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getDeviceInformationHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(_getDeviceInformationNotion(modemIP));
			} else if (modemType == ZTE) {
				resolve(_getDeviceInformationZTE(modemIP));
			} else if (modemType == ADVAN) {
				resolve(_getDeviceInformationAdvan(modemIP));
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getGuestSSIDTime = async (modemIP = '192.168.8.1') => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getGuestSSIDTimeHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const addGuestSSIDTime = async (modemIP = '192.168.8.1', extendTime) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_addGuestSSIDTimeHuawei(modemIP, extendTime));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getGuestSSIDStatus = (modemIP = '192.168.8.1', deviceType) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getGuestSSIDStatusHuawei(modemIP, deviceType));
			} else if (modemType == NOTION) {
				resolve(_getGuestSSIDStatusNotion(modemIP, deviceType));
			} else if (modemType == ZTE) {
				resolve(_getGuestSSIDStatusZTE(modemIP, deviceType));
			} else if (modemType == ADVAN) {
				resolve(_getGuestSSIDStatusAdvan(modemIP, deviceType));
			} else {
				resolve(false)
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const activateGuestSSID = async (modemIP = '192.168.8.1', status, guestSsidData, deviceType) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_activateGuestSSIDHuawei(modemIP, status, guestSsidData, deviceType));
			} else if (modemType == NOTION) {
				resolve(_activateGuestSSIDNotion(modemIP, status, guestSsidData));
			} else if (modemType == ZTE) {
				resolve(_activateGuestSSIDZTE(modemIP, status, guestSsidData));
			} else if (modemType == ADVAN) {
				resolve(_activateGuestSSIDAdvan(modemIP, status, guestSsidData));
			} else {
				resolve(false)
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const postChangeSSIDPasswordGuest = (modemIP = '192.168.8.1', wifiName, password, wifiDuration, deviceType) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_postChangeSSIDPasswordGuestHuawei(modemIP, wifiName, password, wifiDuration, deviceType));
			} else if (modemType == NOTION) {
				resolve(_postChangeSSIDPasswordGuestNotion(modemIP, wifiName, password));
			} else if (modemType == ZTE) {
				resolve(_postChangeSSIDPasswordGuestZTE(modemIP, wifiName, password));
			} else if (modemType == ADVAN) {
				resolve(_postChangeSSIDPasswordGuestAdvan(modemIP, wifiName, password));
			} else {
				resolve(false)
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getModemIsConnectedToInternet = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(_getModemIsConnectedToInternetHuawei(modemIP));
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(false);
			} else {
				resolve(false);
			}
		} catch (error) {
			resolve(false);
		}
	});
};

export const getModemSsidName = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(false);
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(_getModemSsidNameZTE(modemIP));
			} else {
				resolve(false);
			}
			resolve();
		} catch (error) {
			resolve(false);
		}
	});
};

export const postAddDeviceToParental = async (modemIP = '192.168.8.1', macAddress, parentalStatus) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(false);
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(_postAddDeviceToParental(modemIP, macAddress, parentalStatus));
			} else {
				resolve(false);
			}
			resolve();
		} catch (error) {
			resolve(false);
		}
	});
}; 

export const getUserParental = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(false);
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(_getUserParental(modemIP));
			} else {
				resolve(false);
			}
			resolve();
		} catch (error) {
			resolve(false);
		}
	});
}; 

export const getDeviceItSelf = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const { modemType } = store.getState();

			if (modemType == HUAWEI) {
				resolve(false);
			} else if (modemType == NOTION) {
				resolve(false);
			} else if (modemType == ZTE) {
				resolve(_getDeviceItSelf(modemIP));
			} else if (modemType == ADVAN) {
				resolve(_getDeviceItSelfAdvan(modemIP));
			} else {
				resolve(false)
			}
			resolve();
		} catch (error) {
			resolve(false);
		}
	});
}; 
