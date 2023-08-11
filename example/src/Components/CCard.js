// Core
import * as React from 'react';
import { View } from 'react-native';

// Components
import CColors from './CColors';

/**
 * Orbit card component for wrapping content.
 * @example
 * <CCard>
 *    <CTextApp>hellow</CTextApp>
 * </CCard>
 * <CCard top={10} paddingVertical={5} paddingHorizontal={5}>
 *    <CTextApp>hellow</CTextApp>
 * </CCard>
 * @param {any} props
 * @param {number} top - margin top.
 * @param {number} bottom - margin bottom.
 * @param {number} paddingHorizontal - padding horizontal.
 * @param {number} paddingVertical - padding vertical.
 * @param {object} style - custom style if needed.
 */
const CCard = ({
  children,
  top = 0,
  bottom = 0,
  paddingHorizontal = 0,
  paddingVertical = 0,
  style
}) => {
  const cardStyle = {
    marginTop: top,
    marginBottom: bottom,
    backgroundColor: CColors.tselCardBackground,
    paddingHorizontal,
    paddingVertical,
    borderRadius: 16
  };

  return <View style={[cardStyle, style]}>{children}</View>;
};

export default CCard;
