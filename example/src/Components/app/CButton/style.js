import { StyleSheet } from 'react-native';
import { Colors } from '../CThemes';

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
  style,
  disabled,
  outline,
  showTimer,
  top,
  bottom,
  loading,
  outlineColor = Colors.tselRed
) => StyleSheet.create({
  label: {
    fontSize: style?.fontSize ? style.fontSize : 13,
    lineHeight: 16,
    textAlign: 'center',
    color: disabled
      ? outline
        ? Colors.tselRed
        : Colors.white
      : outline
        ? outlineColor
        : Colors.white
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    borderWidth: 1,
    marginTop: top,
    marginBottom: bottom,
    borderColor: disabled && !outline ? 'transparent' : outlineColor,
    backgroundColor: disabled
      ? showTimer
        ? Colors.tselGrey40
        : outline
          ? Colors.white
          : loading
            ? Colors.tselRed
            : Colors.tselGrey40
      : outline
        ? Colors.white
        : Colors.tselRed
  }
});
