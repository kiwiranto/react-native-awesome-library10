import { Platform, StyleSheet } from 'react-native';

import { Colors, Fonts } from '../../Components/app/CThemes';

import { dpi } from '../../Helper/HelperGlobal';
import { dynamicHeight } from '../../Helper/Function';

export const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    backgroundFamily: {
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      zIndex: 5
    },
    toggle: {
      borderRadius: 36,
      backgroundColor: '#e6e6e6',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10
    },
    iconLanguage: {
      width: 20,
      height: 20
    },
    toggleText: {
      fontSize: 12,
      lineHeight: 16,
      color: Colors.tselDarkBlue,
      fontWeight: '700',
      marginLeft: 6
    },
    iconArrowDown: {
      width: 18,
      height: 18,
      marginLeft: 4
    },
    orbitLogo: {
      width: 80,
      height: 38
    },
    contentContainer: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 24,
      paddingTop: '10%'
    },
    titleScreen: {
      fontFamily: 'TelkomselBatikSans-Bold',
      fontSize: 24,
      lineHeight: 27,
      color: Colors.tselDarkBlue
    },
    buttonAction: {
      paddingHorizontal: 18,
      paddingVertical: 16,
      marginBottom: 16,
      borderRadius: 30,
      backgroundColor: Colors.tselRed,
      marginTop: 10
    },
    buttonIcon: {
      width: 24,
      height: 24,
      marginRight: 16
    },
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonTextTitle: {
      fontSize: 14,
      lineHeight: 22,
      color: Colors.white,
      fontFamily: Fonts.poppinsBold
    },
    buttonTextSubtitle: {
      fontSize: 12,
      lineHeight: 16,
      color: Colors.tselGrey100,
      fontFamily: Fonts.poppins
    },
    buyNowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8
    },
    BuyText: {
      fontSize: 12,
      lineHeight: 16,
      color: Colors.tselDarkBlue,
      fontFamily: Fonts.poppinsBold
    },
    dontHave: {
      fontSize: 12,
      lineHeight: 16,
      color: Colors.tselDarkBlue,
      fontFamily: Fonts.poppins
    },
    modalChangeLanguage: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      zIndex: 3
    },
    modalHeight: {
      height: dpi(74)
    },
    lineHorizontal: {
      width: 48,
      height: 3,
      marginTop: 8,
      marginBottom: 36,
      backgroundColor: '#b0b0b0'
    },
    languageStyle: {
      flexDirection: 'row'
    },
    lineHorizontalSecond: {
      width: '100%',
      height: 1,
      marginVertical: 14,
      backgroundColor: '#b0b0b0'
    },
    titleLanguage: {
      fontSize: 18,
      marginLeft: 16
    },
    subtitleContent: {
        fontFamily: Fonts.poppins,
        marginTop: dynamicHeight(1),
        marginBottom: dynamicHeight(2)
    },
    containerModemDescription: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    modemDescription: {
        fontFamily: Fonts.poppins,
        color: Colors.tselGrey100,
        fontSize: 13,
        marginRight: 5
    },
    activationDescription: {
        fontFamily: Fonts.poppinsBold,
        color: Colors.tselRed,
        fontSize: 13,
        marginTop: Platform.OS == 'android' ? -2 : 0
    }
  });
