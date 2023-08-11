import React, { Component } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { CoachmarkArrowProps, CoachmarkPosition } from './types';

export default class CoachmarkArrow extends Component<CoachmarkArrowProps> {
  static defaultProps: Pick<CoachmarkArrowProps, 'position'> = {
    position: CoachmarkPosition.TOP,
  };

  getStyles = (): ViewStyle => {
    if (this.props.position == CoachmarkPosition.TOP) {
      return { borderBottomColor: '#FFF', borderBottomWidth: 12, marginTop: -5 };
    }
    if (this.props.position == CoachmarkPosition.BOTTOM) {
      return { borderTopColor: '#FFF', borderTopWidth: 12, marginBottom: -5 };
    }
    return {};
  };

  render() {
    const { x, arrowOffset } = this.props;
    return <View style={[styles.arrow, this.getStyles(), { marginLeft: x - 10 + (!!arrowOffset ? arrowOffset : 0) }]} />;
  }
}

const styles = StyleSheet.create({
  arrow: {
    width: 0,
    height: 0,
    borderRightWidth: 8,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent'
  }
});
