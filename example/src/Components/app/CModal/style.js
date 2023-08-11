import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '../CThemes';

export const styles = StyleSheet.create({
  buttonCloseIcon: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'contain'
  },
  icon: {
    width: 128,
    height: 128,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24
  },
  title: {
    marginBottom: 16,
    fontSize: 20,
    lineHeight: 27,
    fontFamily: Fonts.telkomselBatikBold,
    textAlign: 'center'
  },
  description: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center'
  },
  cancel: {
    marginTop: 12
  }
});

export const stylesProps = (positionBottom) => StyleSheet.create({
   outterContainer: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      justifyContent: positionBottom ? 'flex-end' : 'center',
      alignItems: 'center',
      backgroundColor: Colors.backgroundColorModal
   },
   innerContainer: {
      width: positionBottom ? '100%' : '90%',
      paddingTop: positionBottom ? 48 : 32,
      paddingBottom: positionBottom ? 32 : 24,
      paddingHorizontal: 24,
      backgroundColor: Colors.white,
      borderRadius: 24,
      borderBottomLeftRadius: positionBottom ? 0 : 24,
      borderBottomRightRadius: positionBottom ? 0 : 24
   },
   buttonCloseContainer: {
      width: 40,
      height: 40,
      position: 'absolute',
      top: positionBottom ? 20 : 10,
      right: positionBottom ? 20 : 10
   },
   accept: {
      marginTop: positionBottom ? 24 : 16
   }
});