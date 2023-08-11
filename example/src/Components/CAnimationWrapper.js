/**
 * This Wrapper is used for animation and update
 */
import React from 'react';
import {
   Linking,
   Platform,
   StatusBar,
   Text,
   TouchableOpacity,
   View
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import 'react-native-gesture-handler';
import NetworkLogger from 'react-native-network-logger';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/react-native';
import i18next from 'i18next';

import { getContentGeneralMs, getNetwokLogger } from '../Helper/ActionGlobal';
import { handlerBackgroundDeeplink, handlerKillAppDeeplink } from '../Helper/Deeplink';
import { fixedDigitAppVersion, formatAppVersion } from '../Helper/Function';
import { appStoreLink, playStoreLink } from '../Helper/HelperGlobal';
import { getStatusBarHeight, supportedFullScreen } from '../Helper/MobileHelper';

import Update from './app/CForceUpdate/update';

class CAnimationWrapper extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         retryUpdate: 0,
         isForceUpdate: false,
         isLoading: true,
         isShowNetworkLogger: false
      };

      i18next.changeLanguage(props.language);
   };

   componentDidMount() {
      this._handlerForceUpdate();
      this._handlerNetworkLogger();
      this._handlerSentryLoader();

      handlerBackgroundDeeplink();
      handlerKillAppDeeplink();

      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
   };

   componentDidUpdate(prevProps) {
      const { modemData } = this.props;
      if (prevProps.modemData?.id === modemData?.id) {
         return;
      }
   }

   componentWillUnmount() {
      Linking.removeEventListener('url');
   };

   _handlerForceUpdate = async () => {
      try {
         const { language } = this.props;
         const { retryUpdate } = this.state;

         const os = Platform.OS === 'android' ? 'latest_version_android' : 'latest_version_ios';
         const result = await getContentGeneralMs(os, language);
         this.setState({ retryUpdate: retryUpdate + 1 });

         if (!result) {
            if (retryUpdate >= 2) {
               this.setState({ isLoading: false });
            } else {
               throw result;
            }
         } else {
            let version = result?.data?.data?.attributes?.title;
            let isForceUpdate = false;

            if (version) {
               const appLatestVersion = formatAppVersion(version);
               const appCurrentVersion = formatAppVersion(DeviceInfo.getVersion());

               isForceUpdate = fixedDigitAppVersion(appLatestVersion) > fixedDigitAppVersion(appCurrentVersion);
            }

            this.setState({
               isForceUpdate,
               isLoading: false
            });
         }
      } catch (error) {
         console.log('CAnimationWrapper@_handlerForceUpdate', error?.message);

         setTimeout(() => {
            this._handlerForceUpdate();
         }, 500);
      }
   };

   _handlerNetworkLogger = async () => {
      await getNetwokLogger();
   };

   _handlerSentryLoader = () => {
      try {
         setInterval(() => {
            const { memberData, modemData } = this.props;
            const memberDataAttributes = memberData?.data?.data?.attributes;
            const isMemberAndModemDataExist = modemData?.attributes && memberData;

            if (isMemberAndModemDataExist) {
               const memberAccount = memberDataAttributes?.emailAccount
                  ? memberDataAttributes?.emailAccount
                  : memberDataAttributes?.facebookAccount
                     ? memberDataAttributes?.facebookAccount
                     : memberDataAttributes?.googleAccount
                        ? memberDataAttributes?.googleAccount
                        : '';

               Sentry.configureScope((scope) => {
                  scope.setUser({
                     id: memberAccount
                  });
               });
            }
         }, 10000);
      } catch (error) {
         console.log('CAnimationWrapper@_handlerSentryLoader', error?.message);
      }
   };

   _handlerOpenUrl = (url) => {
      Linking.canOpenURL(url).then(supported => {
         if (supported) {
            return Linking.openURL(url);
         } else {
            console.log('Don\'t know how to open URI: ' + url);
         }
      }).catch(error => console.error('CAnimationWrapper@_handlerOpenUrl', error));
   };

   render() {
      const { appUpdateStatus, navCleanName, networkLogger } = this.props;
      const { isForceUpdate, isLoading, isShowNetworkLogger } = this.state;

      if (Platform.OS == 'android') {
         if (supportedFullScreen().includes(navCleanName)) {
            StatusBar.setBarStyle('light-content');
         } else {
            StatusBar.setBarStyle('dark-content');
         }
      } else {
         StatusBar.setBarStyle('dark-content');
      }

      return (
         <>
            <View style={{
               width: '100%',
               flex: 1,
               flexDirection: 'row',
               paddingTop: supportedFullScreen().includes(navCleanName) ? 0 : getStatusBarHeight(),
               backgroundColor: '#fff'
            }}>
               {
                  this.props.children
               }

               {
                  networkLogger?.active &&
                  <TouchableOpacity
                     style={{
                        width: 40,
                        height: 40,
                        position: 'absolute',
                        bottom: 5,
                        marginLeft: 5,
                        paddingTop: 12,
                        borderRadius: 30,
                        backgroundColor: '#f8d2d6'
                     }}
                     onPress={() => this.setState({ isShowNetworkLogger: !isShowNetworkLogger })}
                  >
                     <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'bold' }}>
                        {
                           isShowNetworkLogger ? 'HIDE' : 'SHOW'
                        }
                     </Text>
                  </TouchableOpacity>
               }
            </View>

            {
               isShowNetworkLogger && <NetworkLogger />
            }

            <Update
               appUpdateStatus={appUpdateStatus}
               isForceUpdate={isForceUpdate ? true : false}
               isLoading={isLoading}
               onPress={() => {
                  this._handlerOpenUrl(Platform.OS == 'android' ? playStoreLink : appStoreLink);
               }}
            />
         </>
      );
   };
};

const mapStateToProps = state => {
   const {
      appUpdateStatus,
      language,
      memberData,
      modemData,
      navCleanName,
      networkLogger
   } = state;

   return {
      appUpdateStatus,
      language,
      memberData,
      modemData,
      navCleanName,
      networkLogger
   };
};

export default connect(mapStateToProps)(CAnimationWrapper);