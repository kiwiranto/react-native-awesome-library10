// Core
import React from 'react';
import {
  TouchableOpacity,
  View
} from 'react-native';

// Components
import CColors from './CColors';

/**
 * Orbit switch component.
 * @example
 * <CSwitch active={true} />
 * <CSwitch active={false} />
 * <CSwitch active={true} disabled={true} />
 * <CSwitch active={true} disabled={false} />
 * <CSwitch active={true} disabled />
 * @param {function} onPress - switch action when pressed.
 * @param {boolean} disabled - switch can't be pressed.
 * @param {number} top - margin top.
 * @param {number} bottom - margin bottom.
 */
const CSwitch = ({
  disabled = false,
  active = false,
  onPress = () => { },
  top = 0,
  bottom = 0
}) => {
  const switchStyle = {
    width: 40,
    height: 24,
    borderRadius: 24,
    marginTop: top,
    marginBottom: bottom,
    backgroundColor: disabled
      ? CColors.tselGrey60
      : active
        ? '#0050AE'
        : CColors.tselGrey60
  };

  const toggleStyle = {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: CColors.white,
    top: 2,
    right: active ? 2 : null,
    left: active ? null : 2
  };

  return (
    <TouchableOpacity disabled={disabled} onPress={() => onPress()}>
      <View style={switchStyle}>
        <View style={toggleStyle} />
      </View>
    </TouchableOpacity >
  );
};

export default CSwitch;


