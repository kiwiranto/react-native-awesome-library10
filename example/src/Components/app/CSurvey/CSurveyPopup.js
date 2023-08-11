import React, { Component } from 'react';
import {
   Image,
   Linking,
   Platform,
   StyleSheet,
   View
} from 'react-native';

import { adjustSize } from '../../../Helper/Function';
import { appStoreLink, playStoreLink, dpi } from '../../../Helper/HelperGlobal';

import { Colors, Fonts } from '../CThemes';
import CText from '../CText';
import CButton from '../../CButton.mobile';

import { iconCheck } from '../../../Assets/app/shared';

export default class CSurveyPopup extends Component {
   constructor(props) {
      super(props);

      this.state = {
         timerKey: 1,
         isAndroid: Platform.OS == 'android' ? true : false
      };
   };

   _handlerOpenStoreRating = () => {
      const { isAndroid } = this.state;
      const url = isAndroid ? playStoreLink : appStoreLink;

      Linking.canOpenURL(url).then(supported => {
         supported && Linking.openURL(url);
      }, (err) => console.log(err));
   };

   render() {
      const {
         t,
         buttonText,
         iconResult,
         ratingScore,
         subtitle,
         title,
         isSuccess,
         handleButtonOnPress
      } = this.props
      const { isAndroid } = this.state;
      ratingScore ? ratingScore : 0

      return (
         <View style={styles.container}>
            <View style={styles.contentContainer}>
               <Image source={iconResult ? iconResult : iconCheck} style={styles.imageStatus} />

               <CText bold={true} style={styles.titleText}>{title}</CText>

               <CText style={styles.subtitle}>{subtitle}</CText>
            </View>

            <CButton
               styleWrapper={{
                  alignSelf: 'flex-end',
                  marginHorizontal: 0
               }}
               styleProp={{
                  borderRadius: 20,
                  height: 40
               }}
               styleTextContainer={{ marginVertical: 0 }}
               styleBtn={{ fontSize: 16 }}
               txtColor={'#fff'}
               bold={true}
               background={'#ff4c47'}
               label={buttonText}
               onPress={handleButtonOnPress}
            />
         </View>
      );
   };
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: dpi(8),
      paddingVertical: dpi(12)
   },
   contentContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center'
   },
   imageStatus: {
      width: dpi(48),
      height: dpi(48),
      marginBottom: dpi(8)
   },
   titleText: {
      fontSize: dpi(10),
      color: '#1a1a1a',
      marginBottom: dpi(8),
      textAlign: 'center'
   },
   subtitle: {
      width: 343,
      textAlign: 'center',
      fontSize: dpi(8),
      color: '#1a1a1a'
   },
   button: {
      backgroundColor: '#ff4c47',
      borderRadius: 20,
      elevation: 2,
      paddingHorizontal: dpi(12),
      paddingVertical: dpi(5),
      marginTop: dpi(14),
      alignSelf: 'stretch'
   },
   buttonText: {
      color: '#fff',
      fontFamily: 'Muli-Bold',
      textAlign: 'center',
      fontSize: 16
   }
});