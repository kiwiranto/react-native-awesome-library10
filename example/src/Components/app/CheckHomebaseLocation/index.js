import { Image, StyleSheet, View } from 'react-native';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { getHomebaseLocation } from './action';
import { SET_HOMEBASE_DATA, SET_HOMEBASE_LIST_DATA } from '../../../Config/Reducer';
import { getFormattedDate } from '../../../Helper/Function';
import { navigate } from '../../../Navigator/Navigator.mobile';

import { Colors } from '../CThemes';
import CModal from '../CModal';
import CText from '../CText';

import { bgPopupFailed } from '../../../Assets/app/shared';
import { iconStatusPinpointAlreadySet } from '../../../Assets/app/home';
import { iconHomeOutline } from '../../../Assets/app/homebase-transition-screen';

class CheckHomebaseLocation extends PureComponent {
   state = {
      isLoading: false,
      isShowErrorUpdateModal: false,
      isShowNotEligibleUpdateModal: false
   };

   componentDidMount() {
      this._handlerChangeLocation();
   };

   _handlerNavigateOnEligible = (updatedLocation) => {
      if (updatedLocation) {
         navigate('HomebaseLocationScreen');
      } else {
         navigate('HomebaseTransitionScreen');
      }
   };

   _handlerSetHomeBaseToRedux = (isEligibleUpdate, isSet, savedLon, savedLat, savedDisplayName, nextUpdate) => {
      const {
         homebaseData,
         homebaseListData,
         modemData,
         setHomebaseDataDispatch,
         setHomebaseListDataDispatch
      } = this.props;
      const { modem_location_status: locationStatus } = homebaseData || {};

      const resultData = {
         is_eligible_update: isEligibleUpdate,
         is_set: isSet,
         longitude: savedLon, // int  
         latitude: savedLat, // int   
         modem_location_status: (locationStatus == 'NOT_SET_LOCATION' || !!!locationStatus) ? 'UNKNOWN' : locationStatus, // HOME | OUTSIDE_HOME | NOT_SET  
         display_name: savedDisplayName, // string address,   
         next_update: nextUpdate
      };

      //if succeed, save to homebasedata and homebasedatalist
      setHomebaseDataDispatch({
         ...homebaseData,
         ...resultData
      });

      // Create new homebase data
      const newHomebaseData = {
         id: modemData?.id,
         data: resultData
      };

      // Find current homebase data on redux based on member device id
      const homebaseDataIndex = homebaseListData?.findIndex(item => item?.id == modemData?.id);
      const isHomebaseDataExist = homebaseDataIndex !== -1;

      // If it already exist, replace it with the new data, if not then insert new one
      if (isHomebaseDataExist) {
         const newHomebaseListData = homebaseListData;
         newHomebaseListData[homebaseDataIndex] = newHomebaseData;
         setHomebaseListDataDispatch(newHomebaseListData);
      } else {
         const newHomebaseListData = [...homebaseListData, newHomebaseData];
         setHomebaseListDataDispatch(newHomebaseListData);
      }
   };

   _handlerChangeLocation = async () => {
      if (this.state.isLoading) {
         return;
      }

      this.setState({
         isLoading: true
      });

      const { accessTokenData, modemData, onPressCancel } = this.props;

      // check homebaselocation nextupdate from be
      if (accessTokenData?.accessToken && modemData?.attributes?.msisdn) {
         const res = await getHomebaseLocation(accessTokenData?.accessToken, modemData?.attributes?.msisdn);

         const { is_eligible_update: isEligibleUpdate, is_set: isSet, latitude: savedLat, longitude: savedLon, display_name: displayName, next_update: nextUpdate } = res?.data?.data || {};

         // if eligible, navigate to map
         if (isEligibleUpdate || isSet === false) {
            this._handlerSetHomeBaseToRedux(isEligibleUpdate, isSet, savedLon, savedLat, displayName, nextUpdate); //set updated data to homebase
            this.setState({
               isLoading: false
            })

            this._handlerNavigateOnEligible(isSet ? { lat: savedLat, lon: savedLon } : false);
            onPressCancel() //unmount this component

         } else if (isEligibleUpdate == false) { //Error home location already set
            this._handlerSetHomeBaseToRedux(isEligibleUpdate, isSet, savedLon, savedLat, displayName, nextUpdate); //set updated data to homebase
            this.setState({
               isShowNotEligibleUpdateModal: true,
               isLoading: false
            })
         } else { //General Error
            this.setState({
               isShowErrorUpdateModal: true,
               isLoading: false
            })
         }
      }
   };

   render() {
      const { t, homebaseData, isShowErrorLocationUpdate, onPressCancel } = this.props;
      const { isShowNotEligibleUpdateModal, isShowErrorUpdateModal } = this.state;
      const { display_name: displayName, next_update: nextUpdate } = homebaseData || {};

      return (
         <>
            <CModal
               description={t('HomebaseTransitionScreen.PopupErrorGeneral.Description')}
               icon={bgPopupFailed}
               labelCancel={t('Global.Understand')}
               positionBottom={true}
               title={t('HomebaseTransitionScreen.PopupErrorGeneral.Title')}
               visible={isShowErrorUpdateModal}
               onPressCancel={() => {
                  this.setState({
                     isShowErrorUpdateModal: false
                  });
                  onPressCancel();
               }}
            />

            <CModal
               description={
                  <CText nativeId={'txt-eligible-change-date'}>
                     {t('HomebaseErrorLocationUpdatePopup.Description')}
                     <CText bold>
                        {getFormattedDate(new Date(nextUpdate), 'DD MMMM YYYY')}
                     </CText>
                  </CText>
               }
               icon={bgPopupFailed}
               labelAccept={t('Global.Understand')}
               positionBottom={true}
               title={t('HomebaseErrorLocationUpdatePopup.Title')}
               visible={isShowErrorLocationUpdate && isShowNotEligibleUpdateModal}
               onPressAccept={() => {
                  this.setState({
                     isShowNotEligibleUpdateModal: false
                  });
                  onPressCancel();
               }}
            />

            <CModal
               icon={iconStatusPinpointAlreadySet}
               labelCancel={t('Global.Understand')}
               nativeIdTitle={'txt-uneligible-change-location'}
               nativeIdSecond={'btn-understand'}
               positionBottom={true}
               title={t('HomebaseTransitionScreen.PopupIneligibleUpdateLoc.Title')}
               visible={!isShowErrorLocationUpdate && isShowNotEligibleUpdateModal}
               onPressCancel={() => {
                  this.setState({ isShowNotEligibleUpdateModal: false })
                  onPressCancel()
               }}
            >
               <View style={{ paddingVertical: 8 }}>
                  <CText style={styles.popupContentNotEligibleUpdateLocTitle}>
                     {t('HomebaseTransitionScreen.PopupIneligibleUpdateLoc.ContentTitle')}
                  </CText>

                  <View style={styles.popupContentNotEligibleUpdateLocContainer}>
                     <Image source={iconHomeOutline} style={{ width: 16, height: 16, marginRight: 8 }} />
                     <CText numberOfLines={2} style={styles.popupContentNotEligibleUpdateLocValueTitle}>
                        {displayName}
                     </CText>
                  </View>

                  <CText
                     nativeId={'txt-eligible-change-date'}
                     style={styles.popupContentNotEligibleUpdateLocDesc}
                  >
                     {`${t('HomebaseTransitionScreen.PopupIneligibleUpdateLoc.ContentDesc')} \n `}
                     <CText bold>
                        {`${getFormattedDate(new Date(nextUpdate), 'DD MMMM YYYY')}`}
                     </CText>
                  </CText>
               </View>
            </CModal>
         </>
      );
   };
};

const mapStateToProps = (state) => {
   const { accessTokenData, homebaseData, homebaseListData, modemData } = state;
   return {
      accessTokenData,
      homebaseData,
      homebaseListData,
      modemData
   };
};

const mapDispatchToProps = (dispatch) => ({
   setHomebaseDataDispatch: (data) => dispatch({
      type: SET_HOMEBASE_DATA,
      data: data
   }),
   setHomebaseListDataDispatch: data => dispatch({
      type: SET_HOMEBASE_LIST_DATA,
      data: data
   }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CheckHomebaseLocation));

const styles = StyleSheet.create({
   popupContentNotEligibleUpdateLocTitle: {
      fontSize: 13,
      lineHeight: 18,
      color: Colors.tselGrey100,
      marginBottom: 8
   },
   popupContentNotEligibleUpdateLocContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.tselCardBackground,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 13,
      alignItems: 'center'
   },
   popupContentNotEligibleUpdateLocValueTitle: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: Colors.tselGrey100
   },
   popupContentNotEligibleUpdateLocDesc: {
      marginTop: 16,
      fontSize: 13,
      lineHeight: 18,
      color: Colors.tselGrey100,
      marginBottom: 8,
      textAlign: 'center'
   }
});