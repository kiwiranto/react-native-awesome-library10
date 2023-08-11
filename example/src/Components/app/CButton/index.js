// Core
import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  Image,
  View,
  StyleSheet
} from 'react-native';

// Components
import { Colors } from '../CThemes';
import CText from '../CText';
import CTimer from '../CTimer';

/**
 * Orbit default button component.
 * @example
 * <CButton />
 * <CButton outline/>
 * <CButton label="Lanjutkan" />
 * <CButton label="Mengerti" onPress={() => alert('hello world')} />
 * <CButton label="Aktivasi" loading />
 * <CButton label="Aktivasi" disabled />
 * @param {any} props
 * @param {string} label - button name.
 * @param {boolean} outline - button with white background and border color.
 * @param {function} onPress - button action when pressed.
 * @param {boolean} loading - button loading state. delete as soon all components change to isLoading
 * @param {boolean} isLoading - button isLoading state.
 * @param {boolean} disabled - button can't be pressed.
 * @param {number} top - margin top.
 * @param {number} bottom - margin bottom.
 */
const CButton = ({
  label = 'Button',
  outline = false,
  outlineColor = Colors.tselRed,
  iconActive = false,
  iconDisabled = false,
  onPress = () => { },
  loading = false,
  isLoading = false,
  disabled = false,
  top = null,
  bottom = null,
  style = {},
  showTimer = false,
  time = 0,
  timerBracket = false,
  nativeId = '',
  onFinishTimer = () => { },
  ...props
}) => {
  if (loading || isLoading) disabled = true;
  const fontSize = style?.fontSize ? style.fontSize : 13;

  const buttonStyle = {
    ...stylesProps(
      fontSize,
      disabled,
      outline,
      showTimer,
      top,
      bottom,
      outlineColor,
      loading,
      isLoading,
    ).button,
    ...style
  };
  const icon = disabled ? iconDisabled : iconActive;
  const colorLoading = outline ? outlineColor && outlineColor != 'transparent' ? outlineColor : Colors.tselRed : Colors.white;

  return (
    <TouchableOpacity
      testID={nativeId}
      accessibilityLabel={nativeId}
      style={buttonStyle}
      onPress={() => onPress()}
      disabled={(loading || isLoading) ? true : disabled}
      {...props}
    >
      <View style={styles.flexRow}>
        {(loading || isLoading) ? (
          <ActivityIndicator color={colorLoading} />
        ) : (
          <>
            {iconActive && (
              <Image
                source={icon}
                style={styles.icon}
              />
            )}

            <CText
              bold
              style={stylesProps(fontSize, disabled, outline, top, bottom).label}
              children={label}
            />

            {showTimer && (
              <CTimer
                containerStyle={{ marginLeft: 2 }}
                bold
                size={stylesProps().label.fontSize}
                time={time}
                color={Colors.white}
                bracket={timerBracket}
                type={{
                  minutes: true,
                  seconds: true
                }}
                onFinished={() => {
                  if (onFinishTimer) {
                    onFinishTimer();
                  }
                }}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CButton;


export const styles = StyleSheet.create({
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
    bottom: 1
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export const stylesProps = (
  fontSize,
  disabled,
  outline,
  showTimer,
  top,
  bottom,
  outlineColor,
  loading,
  isLoading
) => StyleSheet.create({
  label: {
    fontSize: fontSize,
    lineHeight: 16,
    textAlign: 'center',
    color: disabled
      ? outline
        ? Colors.tselRed
        : Colors.white
      : outline
        ? outlineColor
          ? outlineColor
          : Colors.tselRed
        : Colors.white
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    borderWidth: 2,
    marginTop: top,
    marginBottom: bottom,
    borderColor: disabled && !outline ? 'transparent' : outlineColor,
    backgroundColor: disabled
      ? showTimer
        ? Colors.tselGrey40
        : outline
          ? Colors.white
          : (loading || isLoading)
            ? Colors.tselRed
            : Colors.tselGrey40
      : outline
        ? Colors.white
        : Colors.tselRed
  }
});
