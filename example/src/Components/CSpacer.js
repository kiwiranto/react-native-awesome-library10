// Core
import * as React from 'react';
import { View } from 'react-native';

/**
 * Like sized box on Flutter.
 * @example
 * <CSpacer left={10} />
 * <CSpacer top={5} />
 * @param {any} props
 * @param {number} top - margin top.
 * @param {number} right - margin right.
 * @param {number} bottom - margin bottom.
 * @param {number} left - margin left.
 */
const CSpacer = ({
  top = 0,
  right = 0,
  bottom = 0,
  left = 0
}) => {
  const metrics = {
    marginTop: top,
    marginRight: right,
    marginBottom: bottom,
    marginLeft: left
  };

  return <View style={metrics} />;
};

export default CSpacer;
