import React from 'react';
import {
   Image,
   TouchableOpacity,
   View
} from 'react-native';
import { NavigationContext } from 'react-navigation';

import CTextApp from './CTextApp';
import CFlexRow from './CFlexRow';

import { iconArrowLeftReskin } from '../Assets/app/shared';

/**
 * Orbit back header app.
 * @example
 * <CBackNavigationHeader />
 * <CBackNavigationHeader title='Notifikasi' />
 * @param {any} props
 * @param {string} title - header title.
 * @param {function} onPress - triggered when back icon pressed (default value is navigation.goBack()).
 * @param {Image<source>} rightIcon - right icon.
 * @param {function} rightOnPress - triggered when right icon pressed.
 */
const CBackNavigationHeader = ({
   icon = iconArrowLeftReskin,
   nativeId = '',
   rightIcon = false,
   textStyle = {},
   title = 'Title',
   top = 15,
   onPress = false,
   rightOnPress = () => { }
}) => {
   const navigation = React.useContext(NavigationContext);

   return (
      <CFlexRow top={top} justify='space-between' align='center' paddingVertical={5}>
         <TouchableOpacity onPress={() => onPress ? onPress() : navigation.goBack()}>
            <View style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
               <Image
                  source={icon}
                  style={{ width: 20, height: 20 }}
               />
            </View>
         </TouchableOpacity>

         <CTextApp size={17} style={{ fontFamily: 'TelkomselBatikSans-Bold', ...textStyle }}>
            {title}
         </CTextApp>

         {
            rightIcon ?
               (
                  <TouchableOpacity
                     testID={nativeId}
                     accessibilityLabel={nativeId}
                     onPress={() => rightOnPress()}
                  >
                     <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                        <Image
                           source={rightIcon}
                           style={{ width: 24, height: 24 }}
                        />
                     </View>
                  </TouchableOpacity>
               ) : (
                  <View style={{
                     width: 17,
                     height: 17,
                     marginVertical: 10,
                     marginHorizontal: 20
                  }} />
               )
         }
      </CFlexRow>
   );
};

export default CBackNavigationHeader;