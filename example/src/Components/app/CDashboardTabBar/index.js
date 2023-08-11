import React, { Component } from 'react'
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { CoachmarkLib } from '../../CoachMarkLib';

import { SET_COACH_MARK_DASHBOARD, SET_ENTRYPOINT_DATA } from '../../../Config/Reducer';
import { adjustSize, dynamicWidth } from '../../../Helper/Function';
import { firebaseTracker, firebaseTrackerEngagement } from '../../../Helper/MobileHelper';

import { Colors, Fonts } from '../../../Components/app/CThemes';
import CText from '../../../Components/app/CText';

import {
   iconMainTabHomeActive,
   iconMainTabHome,
   iconMainTabMenuActive,
   iconMainTabMenu,
   iconMainTabStoreActive,
   iconMainTabStore
} from '../../../Assets/app/home';

const screenName = 'Dashboard';

class CDashboardTabBar extends Component {
   constructor(props) {
      super(props);

      this.coachmark = [];
      this.positionCoachmark = [];
   };

   componentDidUpdate(prevProps) {
      const isRefresh = ((prevProps.isRefresh != this.props.isRefresh) && this.props.isRefresh) || prevProps.modemData?.id !== this.props.modemData?.id;
      const stepCoachmark = (prevProps.stepCoachmark != this.props.stepCoachmark) && this.props.stepCoachmark == 4;

      if (stepCoachmark) {
         setTimeout(() => {
            this._handlerCoachmark(4);
         }, 200);
      }

      if (isRefresh) {
         this._handlerGetQuotaListData();
      }
   };

   _handlerOnPressTab = (route) => {
      const { navigation, setEntryPointData } = this.props;
      const data = {
         engagement_type: 'click',
         location: screenName,
         element_type: 'button',
         element_string: route?.routeName
      };
      firebaseTrackerEngagement(data);
      setEntryPointData(null);
      navigation.navigate(route.routeName);
   };

   _handlerIsActive = (routeName) => {
      const { navigation } = this.props;
      const isActive = routeName === navigation?.state?.routeName;
      return isActive;
   };

   _handlerCoachmark = (index = false, scroll = false, choose = false, offsite = 0) => {
      const { setCoachMarkDashboardDispatch } = this.props;
      const scrollCoachmark = (idx, offsite) => {
         this.mainScrollViewRef.scrollTo({ x: 0, y: this.positionCoachmark[idx] - offsite });
         setTimeout(() => {
            this.coachmark[idx]?.show();
         }, 300);
      };

      const coachmark = (idx) => {
         this.coachmark[idx]?.show();
      };

      switch (choose) {
         case 'skip': scrollCoachmark(index, offsite);
            break;
         case 'done': this.mainScrollViewRef.scrollTo({ x: 0, y: 0 }); setCoachMarkDashboardDispatch('done');
            break;
         default: (scroll) ? scrollCoachmark(index, offsite) : coachmark(index);
            break;
      };
   };

   _handlerCloseCoachmark = () => {
      this._handlerCoachmark(0);
      this.props.skipCoachmark();
   };

   render() {
      const { language, t, stepCoachmark, isEligibleHome } = this.props;
      const tabData = [
         {
            id: 'btn-beranda',
            name: language == 'id' ? 'Beranda' : 'Home',
            icon: iconMainTabHome,
            iconActive: iconMainTabHomeActive,
            routeName: 'Home'
         },
         {
            id: 'btn-store',
            name: 'Store',
            icon: iconMainTabStore,
            iconActive: iconMainTabStoreActive,
            routeName: 'Store'
         },
         {
            id: 'btn-menu',
            name: 'Menu',
            icon: iconMainTabMenu,
            iconActive: iconMainTabMenuActive,
            routeName: 'Menu'
         }
      ];

      return (
         <View style={{ ...styles.tabButtonListContainer, paddingBottom: (Platform.OS === 'android' && stepCoachmark === 4) ? 50 : 8 }}>
            <View style={styles.tabButtonContainer}>
               <TouchableOpacity
                  key={tabData[0].id}
                  accessibilityLabel={tabData[0].id}
                  testID={tabData[0].id}
                  style={styles.tabButton}
                  onPress={() => {
                     if (!this._handlerIsActive(tabData?.routeName)) {
                        this._handlerOnPressTab(tabData[0]);
                     }
                  }}
               >
                  <Image
                     source={this._handlerIsActive(tabData[0]?.routeName) ? tabData[0].iconActive : tabData[0].icon}
                     resizeMode={'contain'}
                     style={styles.tabButtonIcon}
                  />

                  <CText style={{
                     ...styles.tabButtonTitle,
                     color: this._handlerIsActive(tabData[0]?.routeName) ? Colors.tselDarkBlue : Colors.tselGrey60
                  }}>
                     {tabData[0].name}
                  </CText>

                  {
                     this._handlerIsActive(tabData[0]?.routeName) && <View style={styles.tabButtonIndicator} />
                  }
               </TouchableOpacity>
            </View>

            <View style={styles.tabButtonContainer}>
               <TouchableOpacity
                  key={tabData[1].id}
                  accessibilityLabel={tabData[1].id}
                  testID={tabData[1].id}
                  style={styles.tabButton}
                  onPress={() => {
                     if (!this._handlerIsActive(tabData[1]?.routeName)) {
                        this._handlerOnPressTab(tabData[1]);
                        firebaseTracker('Dash_store');
                     }
                  }}
               >
                  <Image
                     source={this._handlerIsActive(tabData[1]?.routeName) ? tabData[1].iconActive : tabData[1].icon}
                     resizeMode={'contain'}
                     style={styles.tabButtonIcon}
                  />

                  <CText style={{
                     ...styles.tabButtonTitle,
                     color: this._handlerIsActive(tabData[1]?.routeName) ? Colors.tselDarkBlue : Colors.tselGrey60
                  }}>
                     {tabData[1].name}
                  </CText>

                  {
                     this._handlerIsActive(tabData[1]?.routeName) && <View style={styles.tabButtonIndicator} />
                  }
               </TouchableOpacity>
            </View>

            <View style={styles.tabButtonContainer}>
               <CoachmarkLib
                  arrowOffset={dynamicWidth(66)}
                  buttonNextText={t('Global.Done')}
                  buttonOnContent={true}
                  buttonSkipOffset={-10}
                  closeButton={true}
                  ref={ref => { this.coachmark[4] = ref; }}
                  step={isEligibleHome ? '4/4' : '3/3'}
                  title={t('Coachmark.HomeScreen.AccessMenu')}
                  message={t('Coachmark.HomeScreen.AccessMenuDescriptions')}
                  onNext={() => this._handlerCloseCoachmark()}
                  onSkip={() => this._handlerCloseCoachmark()}
               >
                  <TouchableOpacity
                     key={tabData[2].id}
                     disabled={stepCoachmark === 4}
                     style={styles.tabButton}
                     accessibilityLabel={tabData[2].id}
                     testID={tabData[2].id}
                     onPress={() => {
                        if (!this._handlerIsActive(tabData[2]?.routeName)) {
                           this._handlerOnPressTab(tabData[2]);
                           firebaseTracker('Dashboard_burger_menu');
                        }
                     }}
                  >
                     <Image
                        source={this._handlerIsActive(tabData[2]?.routeName) ? tabData[2].iconActive : tabData[2].icon}
                        resizeMode={'contain'}
                        style={styles.tabButtonIcon}
                     />

                     <CText style={{
                        ...styles.tabButtonTitle,
                        color: this._handlerIsActive(tabData[2]?.routeName) ? Colors.tselDarkBlue : Colors.tselGrey60
                     }}>
                        {tabData[2].name}
                     </CText>
                  </TouchableOpacity>
               </CoachmarkLib>

               {
                  this._handlerIsActive(tabData[2]?.routeName) && <View style={styles.tabButtonIndicator} />
               }
            </View>
         </View>
      );
   };
};

const mapStateToProps = state => {
   const {
      dashboardTabData,
      language
   } = state;

   return {
      dashboardTabData,
      language
   };
};

const mapDispatchToProps = dispatch => ({
   setCoachMarkDashboardDispatch: data => dispatch({
      type: SET_COACH_MARK_DASHBOARD,
      dashboard: data
   }),
   setEntryPointData: (data) => dispatch({
      type: SET_ENTRYPOINT_DATA,
      entryPointData: data
   })
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CDashboardTabBar));

const styles = StyleSheet.create({
   tabButtonListContainer: {
      width: '100%',
      zIndex: 1,
      paddingHorizontal: 48,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: Colors.white,
      paddingBottom: 8
   },
   tabButtonContainer: {
      width: '25%'
   },
   tabButton: {
      backgroundColor: '#fff',
      paddingVertical: 16,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8
   },
   tabButtonIcon: {
      width: 24,
      height: 24,
      marginBottom: 4,
      alignSelf: 'center'
   },
   tabButtonTitle: {
      fontFamily: Fonts.poppins,
      fontSize: adjustSize(10),
      textAlign: 'center',
      color: Colors.tselGrey60
   },
   tabButtonIndicator: {
      width: '100%',
      height: adjustSize(4),
      position: 'absolute',
      top: 0,
      backgroundColor: Colors.tselDarkBlue
   }
});
