// Core
import * as React from 'react';
import { View } from 'react-native';

/**
 * Horizontal line component to separate the top and bottom.
 * @example
 * <CDivider />
 * <CDivider marginVertical={10} color="red" />
 * @param {any} props
 * @param {number} marginVertical - margin between top and down.
 * @param {string} color - divider color.
 * @param {object} style - custom style if needed.
 */
const CDivider = ({
  marginVertical = 0,
  color = '#CCCFD3',
  width = 1,
  style
}) => {
  const dividerStyle = {
    backgroundColor: color,
    height: width,
    width: '100%',
    marginVertical
  };

  return <View style={[dividerStyle, style]} />;
};

export default CDivider;
