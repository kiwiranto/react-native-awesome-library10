// Core
import * as React from 'react';
import { Text, View } from 'react-native';

// Components
import { Colors, Fonts } from '../CThemes';

/**
 * Orbit CCardWidget component.
 * @example
 * <CCardWidget>
 *  <CText>Test</CText>
 *  <CButton>Button Test</CButton>
 * </CCardWidget>
 * @param {any} props
 * @param {string} backgroundColor - background color.
 * @param {number} top - margin top.
 * @param {number} right - margin right.
 * @param {number} bottom - margin bottom.
 * @param {number} left - margin left.
 * @param {object} style - custom style.
 */
const CCardWidget = ({
  children,
  backgroundColor = Colors.tselCardBackground,
  top = 0,
  right = 0,
  bottom = 0,
  left = 0,
  style = {},
  ...props
}) => {
  return <View
    style={{
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: backgroundColor,
      marginTop: top,
      marginRight: right,
      marginBottom: bottom,
      marginLeft: left,
      ...style
    }}
    {...props}
  >
    {children}
  </View>;
};

export default CCardWidget;
