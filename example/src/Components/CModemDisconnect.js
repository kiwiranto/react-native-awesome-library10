import React, { Component } from 'react';
import { StyleSheet, Animated } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

import { LOGOUT, SET_DEEPLINK_DATA } from '../Config/Reducer';
import { dpi } from '../Helper/HelperGlobal';
import { getStatusBarHeight, supportedFullScreen, ToastHandler } from '../Helper/MobileHelper';
import { navigate } from '../Navigator/Navigator.mobile';

import CFactoryResetReskin from './CFactoryResetReskin';
import CModalModemDisconnect from './CModalModemDisconnect';

export const disableInternetActiveByScreenName = (navCleanName) => {
   return !['PairingProcess', 'Welcome'].includes(navCleanName);
};

class CModemDisconnect extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isModemConnected: false,
         valAnim: new Animated.Value(0),
         statusBarColor: '#FF4B47',
         supportedFullScreen: supportedFullScreen(),
         errorMessage: false,
         isInternetReachable: true,
         isVisible: false,
         height: false,
         counterInterval: 0,
         counterOpen: 0,
      };

      this.timeoutPopUp = false;
      this.timeoutDelay = 650;
      this.animationHeightValue = new Animated.Value(0);
   };

   componentDidUpdate(prevProps) {
      const { modemData } = this.props;
      if (prevProps.modemData?.id === modemData?.id) {
         return;
      }
   }

   _modemDisconnected = () => {
      this.refs.modalModemDisconnect.open();
   };

   _handlerAnimatedTiming = (flag = 0) => {
      const { valAnim } = this.state;

      Animated.spring(
         valAnim,
         {
            toValue: flag ? 0 : 1,
            duration: 300,
            useNativeDriver: true
         }
      ).start();
   };

   _handlerActiveStatus = () => {
      setTimeout(() => {
         const { modemData, language } = this.props;

         if (this._handlerModemStatus()) {
            this.setState({
               errorMessage: this._handlerModemStatus() == 'nointernet'
                  ? (language == 'id' ? 'Anda tidak terhubung ke Internet' : 'You are not connected to the Internet')
                  : modemData && 'attributes' in modemData && `${language == 'id' ? 'Anda tidak tersambung ke' : 'You are not connected to'} ${modemData.attributes.ssid}`
            }, () => {
               this._handlerAnimatedTiming(0);
            });
         } else if (modemData) {
            this._handlerAnimatedTiming(1);
         }

      }, this.timeoutDelay);
   };

   _handlerLogout = () => {
      CookieManager.clearAll();
      this.props.logout();
      setTimeout(() => {
         navigate('LoginLanguage', false, this.props);
         ToastHandler(this.props.language == 'id' ? 'Sesi anda telah berakhir' : 'Your session has expired');
      }, 5000);
   };

   _handlerModemStatus = () => {
      const { modemData, navCleanName, isModemConnected, userSyncStatus } = this.props;
      const { isInternetReachable } = this.state;

      if (!isInternetReachable && disableInternetActiveByScreenName(navCleanName)) {
         return 'nointernet';
      }

      return userSyncStatus == 99 && !isModemConnected && 'ssid' in modemData?.attributes;
   };

   render() {
      const { isModemConnected } = this.props;

      return (
         <>
            {
               this.state.counterOpen <= 1 && !isModemConnected &&
               <Modal
                  style={{ ...styles.modal, marginTop: this.state.height ? this.state.height : '75%' }}
                  isVisible={this.state.isVisible}
                  swipeDirection='down'
                  onSwipeStart={() => this.setState({ height: getStatusBarHeight() })}
                  onSwipeComplete={() => this.setState({ isVisible: false })}
                  animationIn={'slideInUp'}
                  animationInTiming={500}
               >
                  <CModalModemDisconnect />
               </Modal>
            }

            <CFactoryResetReskin />
         </>
      );
   };
};

const mapStateToProps = state => {
   const {
      language,
      accessTokenData,
      coachmark,
      isModemConnected,
      listPromo,
      loginTokenIdData,
      memberData,
      modemData,
      nav,
      navCleanName,
      tselPoint,
      userSyncStatus
   } = state;

   return {
      language,
      accessTokenData,
      coachmark,
      isModemConnected,
      listPromo,
      loginTokenIdData,
      memberData,
      modemData,
      nav,
      navCleanName,
      tselPoint,
      userSyncStatus
   };
};

const mapDispatchToProps = dispatch => ({
   logout: () => dispatch({
      type: LOGOUT
   }),
   setDeeplinkData: data => dispatch({
      type: SET_DEEPLINK_DATA,
      deeplinkData: data
   })
});

export default connect(mapStateToProps, mapDispatchToProps)(CModemDisconnect);

const styles = StyleSheet.create({
   modal: {
      margin: 0,
      justifyContent: undefined,
      alignItems: undefined,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: '#fff'
   },
   mainContainer: {
      width: '100%',
      height: dpi(20),
      position: 'absolute',
      flex: 1
   },
   containerPopUpChild: {
      flexDirection: 'row'
   },
   containerPopUp: {
      position: 'absolute',
      height: dpi(11.5),
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#c52025'
   }
});