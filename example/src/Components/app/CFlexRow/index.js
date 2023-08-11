// Core
import React from 'react';
import { View } from 'react-native';

/**
 * Flex Direction row component.
 * @example
 * <CFlexRow>
 *    <CText right={5} size={10}>Hello</CText>
 *    <CText size={10}>World</CText>
 * </CFlexRow>
 * <CFlexRow top={10} justify="center" align="center">
 *    <CText right={5} size={10}>Hello</CText>
 *    <CText size={10}>World</CText>
 * </CFlexRow>
 * @param {any} props
 * @param {number} top - margin top.
 * @param {number} right - margin right.
 * @param {number} bottom - margin bottom.
 * @param {number} left - margin left.
 * @param {number} padding - padding.
 * @param {number} paddingHorizontal - padding horizontal.
 * @param {number} paddingVertical - padding vertical.
 * @param {string} justify - justify content.
 * @param {string} align - align items.
 * @param {string|number} width - component width.
 * @param {object} style - custom style if needed.
 */
const CFlexRow = ({
  children,
  top = 0,
  right = 0,
  bottom = 0,
  left = 0,
  padding = 0,
  paddingHorizontal = 0,
  paddingVertical = 0,
  justify = 'flex-start',
  align = 'stretch',
  width = '100%',
  style = {}
}) => {
  const flewRowStyle = {
    flexDirection: 'row',
    marginTop: top,
    marginRight: right,
    marginBottom: bottom,
    marginLeft: left,
    justifyContent: justify,
    alignItems: align,
    width
  };

  const paddingStyle = padding ? ({ padding }) : ({ paddingHorizontal, paddingVertical });

  return <View style={[flewRowStyle, paddingStyle, style]}>{children}</View>;
};

export default CFlexRow;
