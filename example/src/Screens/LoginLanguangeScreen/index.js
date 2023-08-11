import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import i18next from 'i18next';
import CookieManager from '@react-native-cookies/cookies';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
// import CodePush from 'react-native-code-push';
// import analytics from '@react-native-firebase/analytics';

// ASSETS
import {
  iconChevronDown,
  familyImageReskin
} from '../../Assets/app/login-language';
import {
  iconFlagEnglishReskin,
  iconFlagIndonesiaReskin
} from '../../Assets/app/dashboard';
import { bgExclamation } from '../../Assets/app/shared';
import { styles } from './style';

// COMPONENTS
import CText from '../../Components/app/CText';
import CModal from '../../Components/CModal';
import CLoading from '../../Components/app/CLoading';
import CModalLanguage from '../../Components/app/CModalLanguage';
import { Colors } from '../../Components/app/CThemes';

// HELPER
import {
  // getContentGeneralMs,
  getInfoModem,
  getMemberData
} from '../../Helper/ActionGlobal';
import { filterDataModem, firebaseTracker, firebaseTrackerEngagement, hideUpdateDownload, ToastHandler } from '../../Helper/MobileHelper';
import { wifiAskForUserPermissions } from '../../Helper/ModemLibrary';
import { sentryCapture } from '../../Helper/SentryLib';
// import { adjustTracker } from '../../Helper/Adjust';
import { dynamicHeight } from '../../Helper/Function';
import { baseUrl } from '../../Config/MainConfig';
import { tokenHandler } from '../../Config/Auth';
import { NavigateTo } from '../../Navigator/Navigator';
import { libCheckNotifPermission } from '../WelcomeScreen/action';
import {
  LOGOUT,
  SET_APP_VERSION_DATA,
  SET_DATA_NOTIF,
  SET_DELIVERY_STATUS,
  SET_ENABLE_HOME_MOBILE_APP,
  SET_LANGUAGE,
  SET_MEMBER_DATA,
  SET_MODEM_DATA,
  SET_MODEM_SYNC_DATA,
  SET_MODEM_TYPE
} from '../../Config/Reducer';
import { navigate } from '../../Navigator/Navigator.mobile';

class LoginLanguageScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalLanguage: false,
      isLoading: false,
      isJailBroken: false,
      isExperiment: false,
      isModalCrash: false,
      isOrderPaid: false,
      codePushVersion: false,
      isConnected: false
    };
  };

  async componentDidMount() {
    await this._handleDidMount();
  };

  componentDidUpdate(prevProps) {
    if (this.props.navigation.state.params !== prevProps.navigation.state.params) {
      const navState = this.props.navigation.state;
      if (navState?.params?.isCrash) {
        this.setState({
          isModalCrash: true
        });
      }
    }
  };

  _handleDidMount = async () => {
    const { modemData, navigation, isOnboarding, userSyncStatus } = this.props;

    // If navigate from logout process, reset the params and then navigate to login screen
    // Otherwise, initiate existing functions
    const isLogout = navigation?.state?.params?.isLogout;
    if (isLogout) {
      navigation.setParams({ isLogout: false });
      navigation.navigate('Login');
    } else {
      firebaseTracker('Activation_Screen');

      // CodePush.getUpdateMetadata().then((metadata) => {
      //   if (metadata) {
      //     this.setState({ codePushVersion: metadata.label });
      //   }
      // });

      if (isOnboarding) {
        NavigateTo('Welcome', false, this.props);
      } else {
        hideUpdateDownload(0);
        wifiAskForUserPermissions();

        const isUserActive = userSyncStatus == 99 && typeof modemData.attributes?.activateDate == 'string';

        await this._handlerInit(isUserActive);
      }
    }
  };

  /**
   * Get Modem Info
   * @returns {object} of memberDevice
   */
  _handlerGetModemInfo = async () => {
    try {
      const { accessTokenData, modemActive } = this.props;

      const resultInfoModem = await getInfoModem(accessTokenData.accessToken);
      const dataModem = filterDataModem(resultInfoModem.data.data);
      const modemAttributes = dataModem[modemActive].attributes;

      return modemAttributes;
    } catch (error) {
      console.log('LoginLanguageScreen.index@_handlerGetModemInfo', error);
      sentryCapture(`${JSON.stringify(error)}`, 'Gagal mengambil created date');
      return false;
    }
  };

  /**
   * Get Member Data
   * @returns {object} of memberData
   */
  _handlerGetMemberData = async () => {
    try {
      const { accessTokenData, setMemberData } = this.props;
      let result = await getMemberData(accessTokenData.accessToken);

      if (!result.isError) {
        await setMemberData(result);
        return result.data.data;
      } else {
        return false;
      }
    } catch (error) {
      console.log(`LoginLanguage.index@_handlerGetMemberData ${JSON.stringify(error)}`);
      sentryCapture(`LoginLanguage.index@_handlerGetMemberData ${JSON.stringify(error)}`, 'gagal mendapatkan memberData');
      return false;
    }
  };

  _handlerSplashScreenHide = () => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  };

  _handlerInit = async (skipGetDataUser = false) => {
    this._handlerSplashScreenHide();

    try {
      this.setState({ isLoading: true });

      const { accessTokenData } = this.props;
      const isAccessTokenDataExist = accessTokenData !== false;
      const isAccessTokenDataDoesntExist = accessTokenData === false;
      if (isAccessTokenDataExist) {
        await this._checkTokenStatus();

        if (isAccessTokenDataExist && !skipGetDataUser) {
          const { modemData, modemAndroidOnly } = this.props;
          const resultMemberData = await this._handlerGetMemberData();

          const resultGetModemInfo = await this._handlerGetModemInfo();

          const packageType = resultGetModemInfo?.packageType;

          if (resultMemberData.attributes?.isChangeAccountProcess === true || (Platform.OS === 'ios' && modemAndroidOnly.includes(packageType))) {
            CookieManager.clearAll();
            return this.props.logout();
          }

          const modemType = typeof resultGetModemInfo.packageType == 'string' ? resultGetModemInfo.packageType.split('-')[0] : false;
          const newModemData = {
            ...modemData,
            attributes: resultGetModemInfo
          };

          this.props.setModemData(newModemData);
          this.props.setModemType(modemType);
          const isContinueToDashboard = (typeof newModemData?.attributes?.activeDate == 'string'); /* Check modem is active */

          if (isContinueToDashboard) {
            this.props.setModemSync(99);
          } else {
            this.props.setModemSync(2);
          }

          this._initRedirect();
        } else if (isAccessTokenDataDoesntExist) {
          console.log('LoginLanguageScreen.index@componentDidMount failed to refresh access Token');
          return this._handlerLogout();
        } else {
          this._initRedirect();
        }
      } else {
        this.setState({
          isLoading: false
        });
      }
    } catch (error) {
      this._initRedirect();
    }
  };

  _initRedirect = (callback = false) => {
    const { accessTokenData, userSyncStatus } = this.props;

    if (accessTokenData) {
      const syncStatus = userSyncStatus;
      /**
       * syncStatus code :
       * 1 : Login
       * 2 : OnBoarding Login ==> ActivateDate belum ada
       * 99 : Dashboard ==> Back to Dashboard
       */

      if (syncStatus == 99) {
        NavigateTo('Dashboard', false, this.props);
      } else if (syncStatus == 2) {
        NavigateTo('OnboardingScreen', false, this.props);
      } else {
        NavigateTo('LoginLanguage', false, this.props);
      }
    }

    setTimeout(() => {
      if (typeof callback == 'function') {
        callback();
      }
    }, 1000);

    this._checkNotifPermission();
    this.setState({ isLoading: false });
  };

  _handleOpenModal = () => {
    this.setState({
      modalLanguage: true
    });
  };

  _handleChangeLanguage = (lang) => {
    const { setLanguage } = this.props;

    i18next.changeLanguage(lang, () => {
      setLanguage(lang);
      this.setState({
        modalLanguage: false
      });
    });
  };

  _checkNotifPermission = async () => {
    const { setDataNotificationDispatch, accessTokenData } = this.props;
    if (accessTokenData.accessToken) {
      libCheckNotifPermission({ setDataNotificationDispatch, accessTokenData }, this.props);
    }
  };

  _handlerLogout = () => {
    CookieManager.clearAll();
    this.props.logout();
    setTimeout(() => {
      NavigateTo('LoginLanguage', false, this.props);
      ToastHandler(this.props.language == 'id' ? 'Sesi anda telah berakhir' : 'Your session has expired');
    }, 5000);
  };

  handleGetOrbit = () => {
    const { language } = this.props;

    firebaseTracker('iSetUp_BeliSekarang');
    Linking.openURL(`${baseUrl}/${language}`).catch((err) =>
      console.error('Couldn\'t load page', err)
    );
  };

  handleNavigation = (navName, params = false) => {
    NavigateTo(navName, params, this.props);
  };

  _handlerTracker = (eventName) => {
    const deviceID = DeviceInfo.getUniqueId();

    // analytics().setUserProperty('deviceID', deviceID);
    // analytics().setUserId(deviceID);
    // analytics().logEvent(eventName);

    const data = {
      engagement_type: 'click',
      location: 'LoginLanguageScreen',
      element_type: 'button',
      element_string: eventName
    };
    firebaseTrackerEngagement(data);
  };

  async _checkTokenStatus() {
    await NetInfo.fetch()
      .then((state) => {
        this.setState({
          isConnected: state.isConnected
        });
      });

    const { accessTokenData } = this.props;
    const { isConnected } = this.state;

    if (accessTokenData?.accessToken && isConnected) {
      const { logout } = this.props;
      const tokenStatus = await tokenHandler();

      if (!tokenStatus) {
        setTimeout(() => {
          logout();
          CookieManager.clearAll();
          navigate('LoginLanguage');
        }, 1000);
        return;
      }
    }
  };

  render() {
    const { language, t } = this.props;
    const { isLoading, isModalCrash, codePushVersion, modalLanguage } = this.state;
    const isSmallMobile = Dimensions.get('screen').width <= 350;
    const deviceHeight = (Dimensions.get('screen').height).toFixed(2);
    const deviceWidth = (Dimensions.get('screen').width).toFixed(2);
    const isLongScreen = (deviceHeight / deviceWidth) > 1.80;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={familyImageReskin}
            style={{ ...styles.backgroundFamily, height: isLongScreen ? dynamicHeight(57) : dynamicHeight(67), paddingTop: isSmallMobile ? 26 : 56 }}
            resizeMode={'cover'}
          >
            <TouchableOpacity style={styles.toggle} onPress={() => this._handleOpenModal()}>
              <Image 
                source={language == 'id' ? iconFlagIndonesiaReskin : iconFlagEnglishReskin}
                style={styles.iconLanguage}
                resizeMode="contain"
              />
              <CText style={styles.toggleText}>
                {language == 'id' ? 'ID' : 'EN'}
              </CText>
              <Image
                source={iconChevronDown}
                style={styles.iconArrowDown}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </ImageBackground>

          <View style={styles.contentContainer}>
            <CText style={styles.titleScreen} bold={true}>
              {t('DeliveryStatusScreen.OnBoarding.title')}
            </CText>
            <CText style={styles.subtitleContent}>{t('DeliveryStatusScreen.OnBoarding.Subtitle')}</CText>

            <View style={{ flex: 1 }}>
              <IfFeatureEnabled feature="login">
                <TouchableOpacity
                  style={styles.buttonAction}
                  onPress={() => {
                    firebaseTracker('iSetUp_Login');
                    this._handlerTracker(t('LoginLanguageScreen.ButtonActionLogin'));
                    this.handleNavigation('Login');
                  }}
                  testID={'btn-login'}
                  accessibilityLabel={'btn-login'}
                >
                  <View style={styles.buttonText}>
                    <CText bold={true} style={styles.buttonTextTitle}>{t('LoginLanguageScreen.ButtonActionLogin')}</CText>
                  </View>
                </TouchableOpacity>
              </IfFeatureEnabled>

              <View style={styles.containerModemDescription}>
                <CText style={styles.modemDescription}>{t('LoginLanguageScreen.ModemDescription')}</CText>
                <TouchableOpacity
                  onPress={() => {
                    firebaseTracker('iSetUp_AktivasiModem');
                    // adjustTracker('8kr99g');
                    this.handleNavigation('TutorialScanQRCode', { entryPoint: 'activation-modem' });
                  }}
                  testID={'btn-activation-modem'}
                  accessibilityLabel={'btn-activation-modem'}
                >
                  <CText style={styles.activationDescription}>{t('LoginLanguageScreen.ActivationDescription')}</CText>
                </TouchableOpacity>
              </View >

            </View >

            <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 40 }}>
              <CText style={{ fontSize: 10, color: Colors.tselGrey60 }}>
                App Version {DeviceInfo.getVersion()} {codePushVersion ?? null}
              </CText>
            </View>
          </View >
        </ScrollView >

        {isLoading && <CLoading />
        }

        <CModalLanguage
          visible={modalLanguage}
          onSelectLanguage={() => this.setState({ modalLanguage: false })}
          onClose={() => this.setState({ modalLanguage: false })}
        />

        {/* {this.state.isJailBroken &&
          <CModal
            iconModal={bgExclamation}
            title={t('LoginLanguageScreen.PopUpRooted.Title')}
            subtitle={t('LoginLanguageScreen.PopUpRooted.Desc')}
            label={t('LoginLanguageScreen.PopUpRooted.ButtonAction')}
            firstButtonOnPress={() => {
              BackHandler.exitApp();
            }}
          />
        } */}

        {
          isModalCrash && (
            <CModal
              iconModal={bgExclamation}
              title={t('LoginLanguageScreen.PopUpCrash.Title')}
              subtitle={t('LoginLanguageScreen.PopUpCrash.Desc')}
              label={t('LoginLanguageScreen.PopUpCrash.ButtonAction')}
              firstButtonOnPress={() => {
                this.setState({ isModalCrash: false });
              }}
            />
          )
        }
      </SafeAreaView >
    );
  };
};

const mapStateToProps = (state) => {
  const {
    globalData,
    modemData,
    accessTokenData,
    memberData,
    loginTokenIdData,
    coachmark,
    language,
    loginlanguage,
    modemAndroidOnly,
    isOnboarding,
    userSyncStatus,
    modemActive
  } = state;

  return {
    globalData,
    modemData,
    accessTokenData,
    memberData,
    loginTokenIdData,
    coachmark,
    language,
    loginlanguage,
    modemAndroidOnly,
    isOnboarding,
    userSyncStatus,
    modemActive
  };
};

const mapDispatchToProps = (dispatch) => ({
  setAppversionData: data => dispatch({
    type: SET_APP_VERSION_DATA,
    data: data
  }),
  setLanguage: (data) => dispatch({
    type: SET_LANGUAGE,
    language: data
  }),
  setModemSync: statusCode => dispatch({
    type: SET_MODEM_SYNC_DATA,
    syncStatus: statusCode
  }),
  setDeliveryStatusDispatch: data => dispatch({
    type: SET_DELIVERY_STATUS,
    deliveryStatus: data
  }),
  setDataNotificationDispatch: dataNotif => dispatch({
    type: SET_DATA_NOTIF,
    dataNotifRecieve: dataNotif
  }),
  setEnableHomeMobileApp: data => dispatch({
    type: SET_ENABLE_HOME_MOBILE_APP,
    data: data
  }),
  setMemberData: data => dispatch({
    type: SET_MEMBER_DATA,
    memberData: data
  }),
  setModemData: modemData => dispatch({
    type: SET_MODEM_DATA,
    dataOfModem: modemData
  }),
  setModemType: (data) => dispatch({
    type: SET_MODEM_TYPE,
    data: data
  }),
  logout: () => dispatch({
    type: LOGOUT
  })
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LoginLanguageScreen));
