// Core
import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';

// Components
import CColors from './CColors';
import CFlexRow from './CFlexRow';
import CTextApp from './CTextApp';

/**
 * Orbit default button component.
 * @example
 * <CButtonApp />
 * <CButtonApp outline/>
 * <CButtonApp label="Lanjutkan" />
 * <CButtonApp label="Mengerti" onPress={() => alert('hello world')} />
 * <CButtonApp label="Aktivasi" loading />
 * <CButtonApp label="Aktivasi" disabled />
 * @param {any} props
 * @param {string} label - button name.
 * @param {boolean} outline - button with white background and border color.
 * @param {function} onPress - button action when pressed.
 * @param {boolean} loading - button loading state.
 * @param {boolean} disabled - button can't be pressed.
 * @param {number} top - margin top.
 * @param {number} bottom - margin bottom.
 */
const CButtonApp = ({
  label = 'Button',
  outline = false,
  outlineColor = CColors.tselRed,
  simple = false, // need to refactor
  iconActive = false,
  iconDisabled = false,
  onPress = () => { },
  loading = false,
  disabled = false,
  top = 0,
  bottom = 0,
  style = {},
  nativeId = '',
  ...props
}) => {
  if (loading) disabled = true;
  if (simple) outline = true; // need to refactor (harusnya gk dipake lagi, diganti outline)

  const backgroundDisabled = outline ? 'transparent' : CColors.tselGrey20;
  const buttonStyle = {
    width: '100%',
    height: 46,
    marginTop: top,
    marginBottom: bottom,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: disabled ? 'transparent' : outlineColor,
    backgroundColor: disabled ? backgroundDisabled : outline ? CColors.white : CColors.tselRed,
    ...style
  };
  const icon = disabled ? iconDisabled : iconActive;
  const buttonFontColor = disabled ? CColors.tselGrey60 : outline ? outlineColor : CColors.white;

  return (
    <TouchableOpacity
      testID={nativeId}
      accessibilityLabel={nativeId}
      style={buttonStyle}
      onPress={() => onPress()}
      disabled={disabled}
      {...props}
    >
      {
        loading
          ? <ActivityIndicator color={CColors.tselDarkBlue} />
          : (
            <CFlexRow justify="center" align="center">
              {iconActive ? <Image source={icon} style={{ width: 16, height: 16, marginRight: 8, bottom: 1 }} /> : null}
              <CTextApp size={13} lineHeight={16} color={buttonFontColor} center bold>{label}</CTextApp>
            </CFlexRow>
          )
      }
    </TouchableOpacity>
  );
};

export default CButtonApp;
