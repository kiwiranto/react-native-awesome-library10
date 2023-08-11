// Core
import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

// Helper
import { dpi } from '../Helper/HelperGlobal';

// Components
import CColors from './CColors';
import CTextApp from './CTextApp';


/**
 * Orbit default button component.
 * @example
 * <CButtonAppReskin />
 * <CButtonAppReskin simple/>
 * <CButtonAppReskin label="Lanjutkan" />
 * <CButtonAppReskin label="Mengerti" onPress={() => alert('hello world')} />
 * <CButtonAppReskin label="Aktivasi" loading />
 * <CButtonAppReskin label="Aktivasi" disabled />
 * @param {any} props
 * @param {string} label - button name.
 * @param {boolean} simple - for black and white button.
 * @param {function} onPress - button action when pressed.
 * @param {boolean} loading - button loading state.
 * @param {boolean} disabled - button can't be pressed.
 * @param {number} top - margin top.
 * @param {number} bottom - margin bottom.
 */
const CButtonAppReskin = ({
  label = 'Button',
  outline = false,
  outlineColor = CColors.tselRed,
  simple = false,
  onPress = () => { },
  loading = false,
  disabled = false,
  top = 0,
  bottom = 0,
  styleButton = {},
  styleFont = {},
  nativeId= '',
  ...props
}) => {
  if (simple) outline = true;
  if (loading) disabled = true;

  const buttonStyle = {
    width: '100%',
    height: 46,
    marginTop: top,
    marginBottom: bottom,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: dpi(10),
    borderWidth: dpi(0.5),
    paddingVertical: dpi(4),
    borderColor: disabled ? '#EDECF0' : simple ? CColors.grey100 : '#ED0226',
    backgroundColor: disabled ? '#EDECF0' : simple ? CColors.grey100 : '#ED0226',
    ...styleButton
  };
  const buttonFontStyle = {
    fontFamily: 'Poppins-Bold',
    ...styleFont
  };

  const buttonFontColor = disabled
    ? CColors.tselGrey60
    : outline
      ? outlineColor
      : CColors.white;

  return (
    <TouchableOpacity
      testID={nativeId}
      accessibilityLabel={nativeId}
      style={buttonStyle}
      onPress={() => onPress()}
      disabled={disabled} {...props}
    >
      {
        loading
          ? <ActivityIndicator color={CColors.white} />
          : <CTextApp size={dpi(6.5)} color={buttonFontColor} center style={buttonFontStyle}>{label}</CTextApp>
      }
    </TouchableOpacity>
  );
};

export default CButtonAppReskin;
