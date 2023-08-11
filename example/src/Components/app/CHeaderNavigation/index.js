import React from 'react';
import {
   Image,
   TouchableOpacity,
   View
} from 'react-native';
import { NavigationContext } from 'react-navigation';

import { Colors, Fonts } from '../CThemes';
import CFlexRow from '../CFlexRow';
import CText from '../CText';

import { iconArrowSideLeft } from '../../../Assets/app/shared';
import { dynamicHeight } from '../../../Helper/Function';

/**
 * Orbit back header app.
 * @example
 * <CHeaderNavigation />
 * <CHeaderNavigation title='Notifikasi' />
 * @param {any} props
 * @param {string} title - header title.
 * @param {function} onPress - triggered when back icon pressed (default value is navigation.goBack()).
 * @param {Image<source>} rightIcon - right icon.
 * @param {function} onPressRight - triggered when right icon pressed.
 */
const CHeaderNavigation = ({
   bottom,
   containerStyle = {},
   icon = iconArrowSideLeft,
   iconColor = Colors.tselDarkBlue,
   nativeID = 'btn-arrow-back',
   rightIcon = null,
   rightText = false,
   textStyle = {},
   textColor = Colors.tselDarkBlue,
   title = '',
   top,
   onPress = false,
   onPressRight = () => { }
}) => {
   const navigation = React.useContext(NavigationContext);

   return (
      <CFlexRow
         align={'center'}
         bottom={bottom}
         justify={'space-between'}
         paddingVertical={16}
         paddingHorizontal={16}
         style={containerStyle}
         top={top}
      >
         <TouchableOpacity
            nativeID={nativeID}
            onPress={() => onPress ? onPress() : navigation.goBack()}
         >
            <Image
               source={icon}
               resizeMode={'contain'}
               style={{ width: 24, height: 24, tintColor: iconColor }}
            />
         </TouchableOpacity>

         <View style={{ position: 'absolute', width: '100%', alignItems: 'center', zIndex: -1 }}>
            <CText style={{ fontFamily: Fonts.telkomselBatikBold, fontSize: 16, color: textColor, ...textStyle }}>
               {title}
            </CText>
         </View>

         {
            (rightIcon || rightText) &&
            <TouchableOpacity onPress={() => onPressRight()}>
               {
                  rightIcon &&
                  <Image
                     source={rightIcon}
                     style={{ width: 24, height: 24 }}
                  />
               }

               {
                  rightText &&
                  <CText style={{ fontFamily: Fonts.poppinsBold, fontSize: 12, color: Colors.tselRed }}>
                     {rightText}
                  </CText>
               }
            </TouchableOpacity>
         }
      </CFlexRow>
   );
};

export default CHeaderNavigation;