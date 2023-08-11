import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Clipboard,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import RNInsider from 'react-native-insider';
import { withTranslation } from 'react-i18next';
import analytics from '@react-native-firebase/analytics';
import { CoachmarkLib } from '../../../Components/CoachMarkLib';
import { IfFeatureEnabled } from '@growthbook/growthbook-react';

import {
  iconModemMobileGreyReskin as iconModemMobileGrey,
  iconPhoneMobileGreyReskin as iconPhoneMobileGrey,
  iconFilteringReskin as iconFiltering,
  iconStatisticMobileGreyReskin as iconStatisticMobileGrey,
  iconHelpMobileGreyReskin as iconHelpMobileGrey,
  iconCombinedShapeReskin as iconCombinedShape,
  iconLogoutMegaMenuReskin as iconLogoutMegaMenu,
  bgBackgroundMegaMenuReskin as bgBackgroundMegaMenu,
  iconShapeMegaMenuReskin as iconShapeMegaMenu,
  iconLogoGoogleReskin,
  iconLogofbMegaMenu,
  iconLogoEmailMegaMenu,
  iconInformation,
  iconSimCard,
  bgRectangle,
  iconApple,
  iconUserFeedback,
  iconCopy,
  iconArrowDownBlack
} from '../../../Assets/app/side-drawer';

import { iconFlagEnglishReskin, iconFlagIndonesiaReskin } from '../../../Assets/app/dashboard';
import { iconArrowRightBlackReskin, iconArrowRightWhite, iconWarning } from '../../../Assets/app/shared';
import { LOGOUT, SET_COACH_MARK_DASHBOARD } from '../../../Config/Reducer';
import { NavigateTo } from '../../../Navigator/Navigator';
import { firebaseTrackerEngagement, getIsDisabledFeature, getIsModemAndroidOnlyFullfeature, getSimCardStatus, showReferral, ToastHandler } from '../../../Helper/MobileHelper';
import { dpi } from '../../../Helper/HelperGlobal';
import { getMemberData } from '../../../Helper/ActionGlobal';
import { formatRupiah, isMeetUsageLimitConditions, openPhoneCall } from '../../../Helper/Function';
import { firebaseTracker } from '../../../Helper/MobileHelper';
import CText from '../CText';
import { Colors } from '../CThemes';
import CModal from '../CModal';
import CActiveUntil from '../CActiveUntil';

class CSideDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMember: false,
      provider: false,
      showValidity: false,
      showPopUpCreditLimitService: false
    };
    this.coachmark = [];
    this.positionCoachmark = [];
  }

  _handlerTooglePopUpLogout = () => {
    NavigateTo('Dashboard', { showModalLogOut: true }, this.props);
    this.props.navigation.closeDrawer();
  }

  _getMember = async () => {
    const { accessTokenData, memberData, loginProviderData } = this.props;
    const token = accessTokenData.accessToken;
    if (memberData) {
      this.setState({ dataMember: memberData ? memberData.data.data : '' });
      this.setState({ provider: loginProviderData.provider });
    } else {
      const result = await getMemberData(token);
      this.setState({ provider: loginProviderData.provider });
      if (result) {
        this.setState({ dataMember: result ? result.data.data : '' });
      } else {
        this.setState({ dataMember: false });
      }
    }
  }

  componentDidUpdate = (prevProps) => {
    const { memberData, navigation, modemData } = this.props;
    const propsDevices = modemData || false;
    const prevPropsDevices = prevProps?.modemData || false;

    if (prevPropsDevices?.balance !== propsDevices?.balance) {
      this.setState({ dataMember: memberData ? memberData?.data?.data : '' });
    }

    if (navigation?.state?.isDrawerOpen) {
      this._handleTracker();

      if (prevProps?.coachmark?.dashboard == this.props?.coachmark?.dashboard) {
        if (prevProps?.coachmark?.dashboard == 'step1FromDashboard' || this.props?.coachmark?.dashboard == 'step1FromPrevious') {
          setTimeout(() => {
            this._handlerStepCoachmark(0);
          }, 500);
        }
      }
    }
  };

  componentDidMount() {
    this._getMember();
  }

  _handleTracker = () => {
    const { dataMember } = this.state;
    
    const {
      mobileFullname
    } = dataMember?.attributes || '';
    const { modemData } = this.props;

    const data = {
      engagement_type: 'click',
      location: 'Dashboard',
      element_type: 'button',
      element_string: mobileFullname
    };
    firebaseTracker('Dashboard_burger_menu_screen', { modemName: modemData.attributes?.packageType || '' });
    firebaseTrackerEngagement(data);
  }

  _handleNavigation = (navName, props = this.props) => {
    NavigateTo(navName, false, props);
  };

  _handlerBackToDashboard = () => {
    NavigateTo('Dashboard', { showModal: true, showModalLogOut: false }, this.props);
    this.props.navigation.closeDrawer();
  };

  _handlerCloseValidity = () => {
    const { showValidity } = this.state;

    this.setState({ showValidity: !showValidity });
    setTimeout(() => {
      this.setState({ showValidity: false });
    }, 1500);
  }

  _handlerShowPopUpCreditLimitService = () => {
    const { showPopUpCreditLimitService } = this.state;
    this.setState({ showPopUpCreditLimitService: !showPopUpCreditLimitService });
  }

  _handlerCopyClipboardMsisdn = () => {
    const { t, modemData } = this.props;
    Clipboard.setString(modemData?.attributes?.msisdn || '');
    ToastHandler(t('MegaMenu.CopyClipboardMsisdn'));
  };

  _handlerCoachmark = (index = false, scroll = false, choose = false, offsite = 0) => {
    const { setCoachMarkDashboard, navigation } = this.props;

    const scrollCoachmark = (idx, offsite) => {
      this.ScrollView.scrollTo({ x: 0, y: this.positionCoachmark[idx] - offsite });
      setTimeout(() => {
        this.coachmark[idx]?.show();
      }, 300);
    };

    const coachmark = (idx) => {
      this.coachmark[idx]?.show();
    };

    const scrollUpCoachmark = (idx, offsite) => {
      this.ScrollView.scrollTo(0);
      setTimeout(() => {
        this.coachmark[idx]?.show();
      }, 300);
    };

    switch (choose) {
      case 'skip': scrollCoachmark(index, offsite);
        break;
      case 'done': this.ScrollView.scrollTo({ x: 0, y: 0 }); setCoachMarkDashboard('done'); navigation.closeDrawer();
        break;
      default:
        (scroll == 'scrollDown')
          ? scrollCoachmark(index, offsite)
          : (scroll == 'scrollUp')
            ? scrollUpCoachmark(index, offsite)
            : coachmark(index);
        break;
    };
  }

  _handlerStepCoachmark = (currentStep = false, action = false) => {
    const { modemData, modemFeature, setCoachMarkDashboard, navigation } = this.props;

    const CHANGE_SSID_AND_PASSWORD = modemFeature && modemFeature.feature?.find(({ key }) => key == 'CHANGE_SSID_AND_PASSWORD');
    const LIST_DEVICE = modemFeature && modemFeature.feature?.find(({ key }) => key == 'LIST_DEVICE');
    const WEBSITE_FILTERING = modemFeature && modemFeature.feature?.find(({ key }) => key == 'WEBSITE_FILTERING');

    const isWebsiteFilteringAvailable = WEBSITE_FILTERING?.status == 'ENABLE';
    const isChangeSSIDAvailable = CHANGE_SSID_AND_PASSWORD && CHANGE_SSID_AND_PASSWORD?.status == 'ENABLE';
    const isListDeviceAvailable = LIST_DEVICE && LIST_DEVICE?.status == 'ENABLE';
    const actionNext = action == 'next';

    switch (currentStep) {
      case 0:
        if (isChangeSSIDAvailable) {
          this._handlerCoachmark(1, 'scrollUp');
        } else if (isListDeviceAvailable) {
          this._handlerCoachmark(2);
        } else if (isWebsiteFilteringAvailable) {
          this._handlerCoachmark(3);
        } else {
          this._handlerCoachmark(4, 'scrollDown');
        }
        break;

      case 1:
        if (actionNext) {
          if (isListDeviceAvailable) {
            setCoachMarkDashboard('step2');
            this._handlerCoachmark(2);
          } else if (isWebsiteFilteringAvailable) {
            setCoachMarkDashboard('step3');
            this._handlerCoachmark(3);
          } else {
            setCoachMarkDashboard('step4');
            this._handlerCoachmark(4, 'scrollDown');
          }
        } else {
          setCoachMarkDashboard('step0FromPrevious');
          NavigateTo('Dashboard', false, this.props);
          navigation.closeDrawer();
        }
        break;

      case 2:
        if (actionNext) {
          if (isWebsiteFilteringAvailable) {
            setCoachMarkDashboard('step3');
            this._handlerCoachmark(3);
          } else {
            setCoachMarkDashboard('step4');
            this._handlerCoachmark(4, 'scrollDown');
          }
        } else {
          if (isChangeSSIDAvailable) {
            setCoachMarkDashboard('step1FromPrevious');
            this._handlerCoachmark(1, 'scrollUp');
          } else {
            setCoachMarkDashboard('step0FromPrevious');
            NavigateTo('Dashboard', false, this.props);
            navigation.closeDrawer();
          }
        }
        break;

      case 3:
        if (actionNext) {
          setCoachMarkDashboard('step4');
          this._handlerCoachmark(4, 'scrollDown');
        } else {
          if (isListDeviceAvailable) {
            setCoachMarkDashboard('step2');
            this._handlerCoachmark(2, 'scrollUp');
          } else if (isChangeSSIDAvailable) {
            setCoachMarkDashboard('step1FromPrevious');
            this._handlerCoachmark(1, 'scrollUp');
          } else {
            setCoachMarkDashboard('step0FromPrevious');
            NavigateTo('Dashboard', false, this.props);
            navigation.closeDrawer();
          }
        }
        break;

      default:
        if (actionNext) {
          setCoachMarkDashboard('done');
          this._handlerCoachmark(false, false, 'done');
        } else {
          if (isWebsiteFilteringAvailable) {
            setCoachMarkDashboard('step3');
            this._handlerCoachmark(3, 'scrollUp');
          } else if (isListDeviceAvailable) {
            setCoachMarkDashboard('step2');
            this._handlerCoachmark(2, 'scrollUp');
          } else {
            setCoachMarkDashboard('step1');
            this._handlerCoachmark(1, 'scrollUp');
          }
        }
        break;
    }
  }

  render() {
    const { dataMember, provider, showValidity, showPopUpCreditLimitService } = this.state;
    const { modemData, modemFeature, t, memberData, language, isModemConnected, modemAndroidOnlyFullfeature, navigation } = this.props;

    const CHANGE_SSID_AND_PASSWORD = modemFeature && modemFeature.feature?.find(({ key }) => key == 'CHANGE_SSID_AND_PASSWORD');
    const LIST_DEVICE = modemFeature && modemFeature.feature?.find(({ key }) => key == 'LIST_DEVICE');
    const WEBSITE_FILTERING = modemFeature && modemFeature.feature?.find(({ key }) => key == 'WEBSITE_FILTERING');
    const PAIRING_MODEM = modemFeature && modemFeature.feature?.find(({ key }) => key == 'PAIRING');

    let email = false;
    let icon = false;
    let fullnameUser = false;
    const msisdn = modemData?.attributes?.msisdn || '';

    const {
      facebookAccount,
      facebookFullname,
      googleAccount,
      googleFullname,
      appleAccount,
      emailAccount,
      fullname,
      mobileFullname
    } = dataMember?.attributes || '';

    if (dataMember) {
      if (facebookAccount || googleAccount || appleAccount) {
        if (provider == 'facebook') {
          email = facebookAccount;
          icon = iconLogofbMegaMenu;
          fullnameUser = facebookFullname;
        } else if (provider == 'google') {
          email = googleAccount;
          icon = iconLogoGoogleReskin;
          fullnameUser = googleFullname;
        } else if (provider == 'apple') {
          email = appleAccount;
          icon = iconApple;
          fullnameUser = appleAccount ? appleAccount.substring(0, appleAccount.indexOf('@')) : '';
        }
      } else {
        email = emailAccount;
        icon = iconLogoEmailMegaMenu;
        fullnameUser = fullname != '' ? fullname : mobileFullname;
      }
    }

    const modemDataAttributes = modemData?.attributes;
    const subscriberProfileType = modemDataAttributes?.subscriberProfileType;
    const subscriberProfileTypePostpaid = subscriberProfileType == 'Postpaid';
    const subscriberProfileBilling = modemDataAttributes?.subscriberProfileBilling;
    const usageLimit = subscriberProfileBilling?.credit_limit_domestic || 0;
    const balances = modemDataAttributes?.balance || 0;
    const isCreditLimitConditionFulfilled = subscriberProfileTypePostpaid && isMeetUsageLimitConditions(balances, usageLimit)
    const packageType = modemDataAttributes?.packageType;
    const isModemPairing = typeof modemDataAttributes?.pairingDate == 'string' ? true : false;
    const isWidth = Dimensions.get('window').width <= 412;
    const enableWebsiteFiltering = WEBSITE_FILTERING?.status == 'ENABLE';
    const isShowReferral = showReferral();
    const expiryDate = modemData?.attributes?.expiry_date;
    const simcardStatus = getSimCardStatus(modemData);
    const isDisabledFeature = getIsDisabledFeature(simcardStatus);

    return (
      <View style={styles.drawerContainer}>
        <ImageBackground source={isDisabledFeature ? null : bgBackgroundMegaMenu} style={styles.profilContainer}>

          <View style={styles.changeLanguageContainer1}>
            <View style={styles.changeLanguageContainer2}>
              <TouchableOpacity onPress={() => this._handlerBackToDashboard()} nativeID={'btn-bahasa'}>
                <View style={styles.changeLanguageinnerContainer}>
                  <Image source={language === 'id' ? iconFlagIndonesiaReskin : iconFlagEnglishReskin} style={styles.changeLanguageIconFlag} resizeMode='contain' />
                  <CText style={styles.changeLanguageTitle}>{language.toUpperCase()}</CText>
                  <Image source={iconArrowDownBlack} style={styles.changeLanguageArrowDown} resizeMode='contain' />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileContent}>
            {!dataMember ? (
              <>
                <Placeholder Animation={Fade}>
                  <PlaceholderLine style={{ width: '100%', height: dpi(10) }} />
                </Placeholder>
                <Placeholder Animation={Fade}>
                  <PlaceholderLine style={{ width: '100%', height: dpi(10), marginTop: dpi(2) }} />
                </Placeholder>
                <Placeholder Animation={Fade}>
                  <PlaceholderLine style={{ width: '100%', height: dpi(10), marginTop: dpi(2) }} />
                </Placeholder>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: dpi(2) }}
                  onPress={() => {
                    this._handleNavigation('ProfileScreen', this.props);
                    RNInsider.tagEvent('profile_page_open').addParameterWithString('counter_profile_open', 'counter_profile_open').build();
                    firebaseTracker('Dashboard_profile', { modemName: packageType || '' });
                  }}
                  testID={'btn-profile'}
                  accessibilityLabel={'btn-profile'}
                >
                  {!fullnameUser ? (
                    <CText style={{ ...styles.titleName, fontSize: isWidth ? dpi(11) : dpi(12) }}>{mobileFullname}</CText>
                  ) : (
                    <CText style={{ ...styles.titleName, fontSize: isWidth ? dpi(11) : dpi(12) }}>{fullnameUser && fullnameUser.length >= 15 ? `${fullnameUser?.substring(0, 15)}...` : fullnameUser}</CText>
                  )}
                  <Image source={iconArrowRightWhite} style={{ width: dpi(8), height: dpi(8), marginLeft: dpi(2) }} />
                </TouchableOpacity>

                {(email !== null && email != '') && (
                  <View style={{ alignItems: 'flex-start' }}>
                    <View style={styles.containerEmail}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={icon} style={{ width: dpi(6), height: dpi(6), tintColor: '#001A41' }} resizeMode='contain' />
                        <CText style={{ ...styles.subtitleName }}>{email}</CText>
                      </View>
                    </View>
                  </View>
                )}

                <View style={{ paddingVertical: dpi(8) }}>
                  <View style={styles.contentDetail}>
                    <View style={{ flex: 1, marginRight: dpi(12) }}>
                      <CText style={styles.styleNoModem}>{t('MegaMenu.NoModemLabel')}</CText>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CText style={styles.styleDataNoModem}>{msisdn}</CText>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <TouchableOpacity onPress={() => this._handlerCopyClipboardMsisdn()} nativeID={'btn-copy'}>
                            <Image source={iconCopy} style={{ width: dpi(12), height: dpi(12), marginLeft: dpi(4), tintColor: '#fff' }} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Aktif Hingga */}
                      <CActiveUntil
                        top={8}
                        simcardStatus={simcardStatus}
                        expiryDate={expiryDate}
                      />
                    </View>

                    <View style={{  flex: 1 }}>
                      <CText style={styles.styleNoModem}>
                        {subscriberProfileTypePostpaid ? t('Global.Bill') : t('MegaMenu.BalanceLabel')}
                      </CText>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CText style={styles.styleDataNoModem}>{formatRupiah(modemData?.attributes?.balance)}</CText>
                        {!subscriberProfileTypePostpaid && (
                          <TouchableOpacity onPress={() => this._handlerCloseValidity()}>
                            <Image source={iconInformation} style={{ width: 12, height: 12, marginLeft: 8, bottom: 1 }} />
                          </TouchableOpacity>
                        )}
                      </View>

                      {subscriberProfileTypePostpaid && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                          {isCreditLimitConditionFulfilled && (
                            <TouchableOpacity
                              style={{  marginRight: 6 }}
                              onPress={() => this._handlerShowPopUpCreditLimitService()}
                            >
                              <Image source={iconInformation} style={{ width: 12, height: 12, bottom: 1 }} />
                            </TouchableOpacity>
                          )}

                          <CText size={10} color={Colors.white} style={{ flex: usageLimit?.toString().length > 5 ? 1 : 0 }}>
                            {`${t('MegaMenu.ForLimit')}${formatRupiah(usageLimit)}`}
                          </CText>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </ImageBackground>

        <ScrollView
          ref={ref => this.ScrollView = ref}
          style={{ flex: 1, marginBottom: -3, paddingHorizontal: 10, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => this.position4?.measure((x, y, w, h, px, py) => { this.positionCoachmark[4] = py; })}
        >
          {navigation.state.isDrawerOpen && CHANGE_SSID_AND_PASSWORD && CHANGE_SSID_AND_PASSWORD?.status == 'ENABLE' ?
            <TouchableOpacity
              onPress={() => {
                firebaseTracker('Dashboard_wifi_setting', { modemName: packageType || '' });
                if (!isModemPairing) {
                  if (PAIRING_MODEM && PAIRING_MODEM.status == 'ENABLE') {
                    this._handleNavigation('ByodPairingScreen');
                  } else {
                    this._handleNavigation('WifiSetupScreen', this.props);
                    RNInsider.tagEvent('wifi_setting_open').addParameterWithString('counter_wifi_setting_open', 'counter_wifi_setting_open').build();
                  }
                } else {
                  this._handleNavigation('WifiSetupScreen', this.props);
                  RNInsider.tagEvent('wifi_setting_open').addParameterWithString('counter_wifi_setting_open', 'counter_wifi_setting_open').build();
                }
              }}
              testID={'btn-pengaturan-wifi'}
              accessibilityLabel={'btn-pengaturan-wifi'}
              disabled={isDisabledFeature}
              style={{ opacity: isDisabledFeature ? .5 : 1 }}
            >
              <CoachmarkLib
                ref={ref => this.coachmark[1] = ref}
                onNext={() => { this._handlerStepCoachmark(1, 'next'); }}
                onPrevious={() => {
                  this._handlerStepCoachmark(1, 'previous');
                }}
                isShowPreviousButton
                message={t('DashboardScreen.Coachmark.MegaMenu.WifiSettings')}
                buttonNextText={t('Global.Continue')}
                buttonPrevText={t('Global.Previous')}
              >
                <View style={{ paddingTop: 0, backgroundColor: Colors.white, borderRadius: 8 }}>
                  <View style={styles.menuList}>
                    <Image source={iconModemMobileGrey} style={styles.iconMenu} />
                    <View style={{ width: '85%', flexDirection: 'row' }}>
                      {/* Pengaturan Wifi */}
                      <CText style={styles.menuText}>{t('MegaMenu.WifiSetting')}</CText>
                      {(!isModemConnected || !isModemPairing) && (
                        <View style={{ paddingLeft: dpi(4), paddingTop: dpi(2) }}>
                          <Image source={iconShapeMegaMenu} style={{ width: dpi(5), height: dpi(5) }} resizeMode='contain' />
                        </View>
                      )}
                    </View>
                    <Image
                      source={iconArrowRightBlackReskin}
                      style={styles.iconArrowRightBlackReskin}
                      resizeMode={'contain'}
                    />
                  </View>
                </View>
              </CoachmarkLib>
            </TouchableOpacity> : null}

          {navigation.state.isDrawerOpen && LIST_DEVICE && LIST_DEVICE?.status == 'ENABLE' ?
            <TouchableOpacity
              onPress={() => {
                firebaseTracker('Dashboard_device_setting', { modemName: packageType || '' });
                if (!isModemPairing) {
                  this._handleNavigation('ByodPairingScreen');
                } else {
                  this._handleNavigation('ManageDevice', this.props);
                  RNInsider.tagEvent('device_setting_open').addParameterWithString('counter_device_setting_open', 'counter_device_setting_open').build();
                }
              }}
              testID={(!isModemPairing) ? 'btn-byod-pairing' : 'btn-manage-device'}
              accessibilityLabel={(!isModemPairing) ? 'btn-byod-pairing' : 'btn-manage-device'}
              disabled={isDisabledFeature}
              style={{ opacity: isDisabledFeature ? .5 : 1 }}
            >
              <CoachmarkLib
                ref={ref => this.coachmark[2] = ref}
                onNext={() => { this._handlerStepCoachmark(2, 'next'); }}
                onPrevious={() => {
                  this._handlerStepCoachmark(2, 'previous');
                }}
                isShowPreviousButton
                message={t('DashboardScreen.Coachmark.MegaMenu.DeviceSettings')}
                buttonNextText={t('Global.Continue')}
                buttonPrevText={t('Global.Previous')}
              >
                <View style={{ paddingTop: 0, backgroundColor: Colors.white, borderRadius: 8 }}>
                  <View style={styles.menuList}>
                    <Image source={iconPhoneMobileGrey} style={styles.iconMenu} />
                    <View style={{ width: '85%', flexDirection: 'row' }}>
                      {/* Pengaturan Perangkat */}
                      <CText style={styles.menuText}>{t('MegaMenu.ManageDevice')}</CText>
                      {(!isModemConnected || !isModemPairing) && (
                        <View style={{ paddingLeft: dpi(4), paddingTop: dpi(2) }}>
                          <Image source={iconShapeMegaMenu} style={{ width: dpi(5), height: dpi(5) }} resizeMode='contain' />
                        </View>
                      )}
                    </View>
                    <Image
                      source={iconArrowRightBlackReskin}
                      style={styles.iconArrowRightBlackReskin}
                      resizeMode={'contain'}
                    />
                  </View>
                </View>
              </CoachmarkLib>
            </TouchableOpacity> : null
          }

          {navigation.state.isDrawerOpen && enableWebsiteFiltering && (
            <TouchableOpacity
              onPress={() => {
                firebaseTracker('Dashboard_website_filtering', { modemName: packageType || '' });
                if (!isModemPairing) {
                  this._handleNavigation('ByodPairingScreen');
                } else {
                  analytics().setUserProperty('userID', memberData.data.data.id);
                  analytics().setUserId(memberData.data.data.id);
                  analytics().logEvent('websiteFiltering');

                  this._handleNavigation('BlackList', this.props);
                }
              }}
              testID={'btn-website-filtering'}
              accessibilityLabel={'btn-website-filtering'}
              disabled={isDisabledFeature}
              style={{ opacity: isDisabledFeature ? .5 : 1 }}
            >
              <CoachmarkLib
                ref={ref => this.coachmark[3] = ref}
                onNext={() => { this._handlerStepCoachmark(3, 'next'); }}
                onPrevious={() => {
                  this._handlerStepCoachmark(3, 'previous');
                }}
                isShowPreviousButton
                message={t('DashboardScreen.Coachmark.MegaMenu.WebsiteFiltering')}
                buttonNextText={t('Global.Continue')}
                buttonPrevText={t('Global.Previous')}
              >
                <View style={{ paddingTop: 0, backgroundColor: Colors.white, borderRadius: 8 }} >
                  <View style={styles.menuList}>
                    <Image source={iconFiltering} style={styles.iconMenu} />
                    <View style={{ width: '85%', flexDirection: 'row' }}>
                      {/* Website Filtering */}
                      <CText style={styles.menuText}>{t('MegaMenu.WebFiltering')}</CText>
                      {(!isModemConnected || !isModemPairing) && (
                        <View style={{ paddingLeft: dpi(4), paddingTop: dpi(2) }}>
                          <Image source={iconShapeMegaMenu} style={{ width: dpi(5), height: dpi(5) }} resizeMode='contain' />
                        </View>
                      )}
                    </View>
                    <Image
                      source={iconArrowRightBlackReskin}
                      style={styles.iconArrowRightBlackReskin}
                      resizeMode={'contain'}
                    />
                  </View>
                </View>
              </CoachmarkLib>
            </TouchableOpacity>
          )}

          <IfFeatureEnabled feature="usage-statistics">
            <TouchableOpacity
              onPress={() => {
                firebaseTracker('Dashboard_usage_statistics', { modemName: packageType || '' });
                this._handleNavigation('StatisticUsageScreen', this.props);
                RNInsider.tagEvent('usage_statistic_open').addParameterWithString('counter_usage_statistic_open', 'counter_usage_statistic_open').build();
              }}
              testID={'btn-statistik-pemakaian'}
              accessibilityLabel={'btn-statistik-pemakaian'}
              disabled={isDisabledFeature}
              style={{ opacity: isDisabledFeature ? .5 : 1 }}
            >
              <CoachmarkLib
                ref={ref => this.coachmark[4] = ref}
                onNext={() => { this._handlerStepCoachmark(4, 'next'); }}
                onPrevious={() => {
                  this._handlerStepCoachmark(4, 'previous');
                }}
                isShowPreviousButton
                message={t('DashboardScreen.Coachmark.MegaMenu.StatisticUsage')}
                buttonNextText={t('Global.Understand')}
                buttonPrevText={t('Global.Previous')}
              >
                <View
                  style={{ paddingTop: 0, backgroundColor: Colors.white, borderRadius: 8 }}
                  onLayout={() => { this.position4?.measure((x, y, w, h, px, py) => { this.positionCoachmark[4] = py; }); }}
                  ref={ref => this.position4 = ref}
                >
                  <View style={styles.menuList}>
                    <Image source={iconStatisticMobileGrey} style={styles.iconMenu} />
                    <View style={{ width: '85%' }}>
                      <CText style={styles.menuText}>{t('MegaMenu.StatisticUsage')}</CText>
                    </View>
                    <Image
                      source={iconArrowRightBlackReskin}
                      style={styles.iconArrowRightBlackReskin}
                      resizeMode={'contain'}
                    />
                  </View>
                </View>
              </CoachmarkLib>
            </TouchableOpacity>
          </IfFeatureEnabled>

          <TouchableOpacity
            onPress={() => {
              this._handleNavigation('HelpScreen', this.props)
              RNInsider.tagEvent('help_open').addParameterWithString('counter_help_open', 'counter_help_open').build();
              firebaseTracker('Dashboard_help', { modemName: packageType || '' });
            }}
            testID={'btn-help'}
            accessibilityLabel={'btn-help'}
          >
            <View style={styles.menuList}>
              <Image source={iconHelpMobileGrey} style={styles.iconMenu} />
              <View style={{ width: '85%' }}>
                <CText style={styles.menuText}>{t('MegaMenu.Help')}</CText>
              </View>
              <Image
                source={iconArrowRightBlackReskin}
                style={styles.iconArrowRightBlackReskin}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>

          {isShowReferral && (
            <TouchableOpacity
              onPress={() => {
                this._handleNavigation('ReferralCodeScreen', this.props);
                RNInsider.tagEvent('referral_orbit_open').addParameterWithString('counter_referral_orbit_open', 'counter_referral_orbit_open').build();
              }}
              testID={'btn-refrensi'}
              accessibilityLabel={'btn-refrensi'}
              disabled={isDisabledFeature}
              style={{ opacity: isDisabledFeature ? .5 : 1 }}
            >
              <View style={styles.menuList}>
                <Image source={iconCombinedShape} style={styles.iconMenu} />
                <View style={{ width: '85%' }}>
                  <CText style={styles.menuText}>{t('MegaMenu.Refferal')}</CText>
                </View>
                <Image
                  source={iconArrowRightBlackReskin}
                  style={styles.iconArrowRightBlackReskin}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => this._handlerTooglePopUpLogout()}
            testID={'btn-logout'}
            accessibilityLabel={'btn-logout'}
          >
            <View style={{ ...styles.menuList, borderBottomWidth: 0 }}>
              <Image source={iconLogoutMegaMenu} style={styles.iconMenu} />
              <View style={{ width: '85%' }}>
                <CText style={styles.menuText}>{t('MegaMenu.Logout')}</CText>
              </View>
              <Image
                source={iconArrowRightBlackReskin}
                style={styles.iconArrowRightBlackReskin}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>

        </ScrollView>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('FeedbackScreen')}
          testID={'btn-tanggapan'}
          accessibilityLabel={'btn-tanggapan'}
        >
          <View style={{ paddingHorizontal: dpi(8), paddingVertical: dpi(8) }}>
            <View style={{ flexDirection: 'row', backgroundColor: '#F6F3F3', borderRadius: dpi(6) }}>
              <View style={{ padding: 15 }}>
                <Image source={iconUserFeedback} style={{ width: dpi(10.67), height: dpi(10.67) }} />
              </View>

              <View style={{ paddingVertical: 16, maxWidth: '60%' }}>
                {/* Berikan Tanggapan Anda */}
                <CText size={dpi(6.5)} color='#001A41' style={{ fontFamily: 'Poppins-Bold' }}>{t('MegaMenu.FeedbackTitle')}</CText>
                {/* Tanggapan Anda penting untuk kami */}
                <CText size={dpi(6)} color='#001A41' style={{ fontFamily: 'Poppins-Regular' }}>{t('MegaMenu.FeedbackSubTitle')}</CText>
              </View>

              <View style={{ flexGrow: 1, alignItems: 'flex-end' }}>
                <View style={{ padding: 20 }}>
                  <Image
                    source={iconArrowRightBlackReskin}
                    style={styles.iconArrowRightBlackReskin}
                    resizeMode={'contain'}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {showValidity && (
          <ImageBackground source={bgRectangle} style={styles.rectangle}>
            <View style={styles.contentRectangle}>
              <Image source={iconSimCard} style={{ width: dpi(8), height: dpi(8) }} />
              <CText style={{ marginLeft: dpi(2), color: '#000000', fontSize: dpi(6), fontFamily: 'Poppins-Regular', marginTop: dpi(2) }}>
                {t('MegaMenu.ValidUntil')}  <Text style={styles.titleValid}>{modemData?.attributes ? modemData.attributes.expiry_date.replace(/-/g, ' ') : 'Unknown'}</Text>
              </CText>
            </View>
          </ImageBackground>
        )}

        <CModal
          positionBottom
          visible={showPopUpCreditLimitService}
          icon={iconWarning}
          title={t('MegaMenu.ModalCreditLimitService.Title')}
          description={t('MegaMenu.ModalCreditLimitService.Description')}
          labelAccept={t('Global.Call188')}
          labelCancel={t('Global.Understand')}
          onPressAccept={() => { openPhoneCall('188'); }}
          onPressCancel={() => { this._handlerShowPopUpCreditLimitService(); }}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setCoachMarkDashboard: data => dispatch({
    type: SET_COACH_MARK_DASHBOARD,
    dashboard: data
  }),
  logout: () => dispatch({ type: LOGOUT })
});

const mapStateToProps = state => {
  const { modemData, accessTokenData, language, loginProviderData, memberData, coachmark, modemFeature, isModemConnected, modemAndroidOnlyFullfeature } = state;
  return {
    modemData,
    accessTokenData,
    language,
    loginProviderData,
    memberData,
    coachmark,
    modemFeature,
    isModemConnected,
    modemAndroidOnlyFullfeature
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CSideDrawer));

const marginLeft = Dimensions.get('window').width * 0.37;
const styles = StyleSheet.create({
  drawerContainer: {
    width: '100%',
    height: '100%'
  },
  profilContainer: {
    width: '100%',
    backgroundColor: Colors.tselGrey60,
    marginBottom: 0,
    zIndex: 99,
    elevation: 99
  },
  profileContent: {
    paddingTop: dpi(8),
    paddingLeft: dpi(12),
    paddingRight: dpi(12)
  },
  containerName: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageProfil: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 100
  },
  containerEmail: {
    borderRadius: dpi(5),
    backgroundColor: '#E9E4E4',
    marginTop: dpi(2),
    paddingHorizontal: dpi(3),
    paddingVertical: dpi(1.5),
    flexDirection: 'row'
  },
  titleName: {
    fontSize: dpi(12),
    lineHeight: dpi(16),
    color: '#ffffff',
    fontFamily: 'TelkomselBatikSans-Bold'
  },
  contentDetail: {
    width: '100%',
    flexDirection: 'row'
  },
  styleNoModem: {
    fontSize: dpi(6),
    lineHeight: dpi(8),
    color: '#ffffff',
    fontFamily: 'Poppins-Regular'
  },
  styleDataNoModem: {
    fontSize: dpi(7),
    lineHeight: dpi(12),
    color: '#ffffff',
    fontFamily: 'Poppins-Bold'
  },
  styleDataPulsa: {
    fontSize: dpi(7),
    lineHeight: dpi(12),
    color: '#ffffff'
  },
  subtitleName: {
    fontSize: dpi(5),
    lineHeight: dpi(8),
    color: '#001A41',
    paddingLeft: dpi(3),
    fontFamily: 'Poppins-Bold'
  },
  subtitleText: {
    fontSize: 10,
    fontFamily: 'Muli-Regular'
  },
  menuList: {
    width: '90%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f5f9fc',
    marginHorizontal: 8,
    justifyContent: 'space-between'
  },
  menuText: {
    alignContent: 'flex-start',
    fontFamily: 'Poppins-Bold',
    fontSize: dpi(6.5),
    justifyContent: 'center',
    color: '#001A41'
  },
  iconMenu: {
    width: 24,
    height: 24,
    marginRight: 8
  },
  rectangle: {
    width: 200,
    height: dpi(24),
    zIndex: 100,
    elevation: 100,
    position: 'absolute',
    top: 225,
    left: marginLeft
  },
  contentRectangle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: dpi(15),
    paddingTop: dpi(8)
  },
  titleValid: {
    fontSize: dpi(6),
    fontFamily: 'Poppins-Bold'
  },
  changeLanguageContainer1: {
    paddingTop: 58,
    paddingHorizontal: 16,
    alignItems: 'flex-end'
  },
  changeLanguageContainer2: {
    padding: 6,
    borderRadius: dpi(18),
    backgroundColor: '#ffffff'
  },
  changeLanguageinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dpi(2),
    paddingHorizontal: dpi(1)
  },
  changeLanguageIconFlag: {
    width: dpi(12),
    height: dpi(12)
  },
  changeLanguageTitle: {
    fontSize: dpi(6),
    lineHeight: dpi(8),
    color: '#001A41',
    paddingLeft: dpi(3),
    fontFamily: 'Poppins-Bold',
    marginRight: dpi(5),
    marginLeft: dpi(1)
  },
  changeLanguageArrowDown: {
    width: dpi(6),
    height: dpi(6),
    tintColor: '#001A41'
  },
  iconArrowRightBlackReskin: {
    width: dpi(10.67),
    height: dpi(5.33),
    tintColor: '#001A41'
  },
  backgroundTooltip: {
    width: 231,
    backgroundColor: Colors.tselCardBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    position: 'absolute',
    left: 0,
    bottom: -50
  },
  triangle: {
    position: 'absolute',
    top: -10,
    left: 8,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 15,
    borderBottomWidth: 17,
    borderLeftWidth: 15,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.tselCardBackground,
    borderLeftColor: 'transparent'
  }
});
