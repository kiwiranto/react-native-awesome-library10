import React, { useEffect, useRef } from 'react';
import {
  Image,
  Platform,
  View,
  Animated,
  Dimensions
} from 'react-native';
import { iconInfoRed, iconValidGreen } from '../../../Assets/app/shared';
import { Colors } from '../CThemes';
import CText from '../CText';

const CToast = ({
  message = 'change the message props',
  iconModal = iconValidGreen,
  red = false,
  backgroundColor = Colors.tselLightBlue,
  top = Platform.OS === 'ios' ? 25 : 16,
  isVisible = false
}) => {
  const windowHeight = Dimensions.get("window").height;
  const popAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      popIn()
    } else {
      popOut()
    }
  }, [isVisible])

  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: top,
      delay: 300,
      duration: 300
    }).start();
  };

  const popOut = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * -0.1,
      duration: 300
    }).start();
  };

  if (red) iconModal = iconInfoRed;

  const containerStyle = {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    alignItems: 'center',
    width: '100%'
  };

  const toastStyle = {
    width: '92%',
    backgroundColor: red ? Colors.tselPalePink : backgroundColor,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center'
  };

  return (
    <Animated.View style={[containerStyle, { top: popAnim }]}>
      <View style={toastStyle}>
        <Image source={iconModal} style={{ width: 16, height: 16 }} />

        <CText
          left={10}
          size={12}
          lineHeight={16}
          color={red ? Colors.tselDarkOrange : Colors.tselDarkBlue}
          style={{ flex: 1 }}
        >
          {message}
        </CText>
      </View>
    </Animated.View>

  );
};

export default CToast;
