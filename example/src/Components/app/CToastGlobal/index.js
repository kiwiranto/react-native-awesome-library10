import React, { useState, useRef } from 'react';
import {
   Image,
   Platform,
   View,
   Animated,
   Dimensions
} from 'react-native';

import { Colors } from '../CThemes';
import CText from '../CText';

import { iconInfoBlue, iconInfoRed, iconInfoYellow, iconValidGreen } from '../../../Assets/app/shared';

export const ToastRef = React.createRef();

export const ToastType = {
   NEUTRAL: {
      iconModal: iconInfoBlue,
      textColor: Colors.tselDarkBlue,
      backgroundColor: Colors.tselLightBlue,
   },
   SUCCESS: {
      iconModal: iconValidGreen,
      textColor: Colors.tselDarkBlue,
      backgroundColor: Colors.tselSpearmint,
   },
   WARN: {
      iconModal: iconInfoYellow,
      textColor: Colors.tselDarkOrange,
      backgroundColor: Colors.palePeach,
   },
   ERROR: {
      iconModal: iconInfoRed,
      textColor: Colors.tselDarkOrange,
      backgroundColor: Colors.tselPalePink,
   }
}

const CToastGlobal = React.forwardRef(({
   top = Platform.OS === 'ios' ? 55 : 66,
}, ref) => {
   const [message, setMessage] = useState("");
   const [visible, setVisible] = useState(false);
   const [attribute, setAttribute] = useState(ToastType.NEUTRAL);
   const windowHeight = Dimensions.get("window").height;
   const popAnim = useRef(new Animated.Value(0)).current;

   React.useImperativeHandle(ref, () => ({
      show: popIn
   }));

   const popIn = (message = "", type = ToastType.NEUTRAL, attribute = false) => {
      setMessage(message)
      setAttribute({
         iconModal: attribute?.iconModal || type.iconModal,
         textColor: attribute?.textColor || type.textColor,
         backgroundColor: attribute?.backgroundColor || type.backgroundColor,
         nativeID: attribute?.nativeID
      })
      setVisible(true)

      Animated.sequence([
         Animated.timing(popAnim, {
            toValue: top,
            duration: 250
         }),
         Animated.timing(popAnim, {
            toValue: windowHeight * -0.1,
            delay: 1200,
            duration: 500
         })
      ]).start(() => {
         setVisible(false)
      })
   };

   const containerStyle = {
      position: 'absolute',
      top: 0,
      zIndex: 10,
      alignItems: 'center',
      width: '100%'
   };

   const toastStyle = {
      width: '92%',
      backgroundColor: attribute.backgroundColor,
      borderRadius: 4,
      paddingHorizontal: 12,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center'
   };

   const nativeID = attribute?.nativeID || '';

   if (visible) {
      return (
         <Animated.View style={[containerStyle, { top: popAnim }]} accessibilityLabel={nativeID} testID={nativeID}>
            <View style={toastStyle}>
               <Image source={attribute.iconModal} style={{ width: 16, height: 16 }} />

               <CText
                  left={10}
                  size={12}
                  lineHeight={16}
                  color={attribute.textColor}
                  style={{ flex: 1 }}
               >
                  {message}
               </CText>
            </View>
         </Animated.View>
      );
   } else {
      return null;
   }

});

export default CToastGlobal;