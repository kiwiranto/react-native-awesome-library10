import React, { Component } from 'react';
import {
   Image,
   StyleSheet,
   TouchableOpacity,
   View
} from 'react-native';
import { NavigationContext } from 'react-navigation';

import { adjustSize } from '../../../Helper/Function';

import { Colors, Fonts } from '../CThemes';
import CText from '../CText';

import { iconArrowSideLeft } from '../../../Assets/app/shared';

const CHeaderNav = ({
   actionIcon,
   title,
   onPress,
   onPressAction
}) => {
   const navigation = React.useContext(NavigationContext);

   return (
      <View style={styles.headerContainer}>
         <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => onPress ? onPress() : navigation.goBack()}
         >
            <Image
               source={iconArrowSideLeft}
               resizeMode={'contain'}
               style={styles.headerBackButtonIcon}
            />
         </TouchableOpacity>

         <CText style={styles.headerTitle}>
            {title}
         </CText>

         {
            (actionIcon && onPressAction) &&
            <TouchableOpacity
               style={styles.headerActionButton}
               onPress={onPressAction}
            >
               <Image
                  source={actionIcon}
                  resizeMode={'contain'}
                  style={styles.headerActionButtonIcon}
               />
            </TouchableOpacity>
         }
      </View>
   );
};

export default CHeaderNav;

const styles = StyleSheet.create({
   headerContainer: {
      paddingVertical: 20,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.white
   },
   headerBackButton: {
      position: 'absolute',
      left: 16,
      zIndex: 1
   },
   headerBackButtonIcon: {
      width: adjustSize(24),
      height: adjustSize(24)
   },
   headerTitle: {
      paddingHorizontal: 32,
      flex: 1,
      fontFamily: Fonts.telkomselBatikBold,
      fontSize: adjustSize(16),
      textAlign: 'center',
      color: Colors.tselDarkBlue
   },
   headerActionButton: {
      position: 'absolute',
      right: 16,
      zIndex: 1
   },
   headerActionButtonIcon: {
      width: adjustSize(24),
      height: adjustSize(24)
   },
});