import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { store } from '../../Config/Store';
import CButton from '../app/CButton';
import CText from '../app/CText';
import { Colors, Fonts } from '../app/CThemes';
import { CoachmarkContentProps } from './types';
import { iconClose } from '../../Assets/app/shared';

export default class CoachmarkContent extends Component<CoachmarkContentProps> {
  static defaultProps: Pick<CoachmarkContentProps, 'buttonNextText'> = {
    buttonNextText: 'OK'
  };
  render() {
    const iconCoachmark = require('./ic_coachmark.png');
    const language = store.getState().language;
    const {
      leadingIcon,
      title,
      step,
      message,
      buttonOnContent,
      buttonPrevText,
      buttonNextText,
      onNext,
      onShow,
      onSkip,
      onPrev,
      showButtonPrev,
      styleButtonOnContent,
      closeButton,
      buttonOnDone,
      styleButtonOnDone
    } = this.props;

    return (
      <View style={styles.contentContainer}>
        <View style={styles.step}>
          {!!step && <CText>{step}</CText>}
          <View style={{ alignItems: 'flex-end', flex: 1 }}>
            {
              closeButton && 
              <TouchableOpacity onPress={onSkip} >
                <Image source={iconClose} style={styles.searchIcon} />
              </TouchableOpacity>
            }
          </View>
        </View>

        <View style={styles.container}>
          {!!leadingIcon && (
            <Image style={styles.icon} source={iconCoachmark} />
          )}
          <View style={styles.message}>
            {title ? <CText fontTselBatik bold style={styles.messageTitle}>{title}</CText> : null}
            <CText style={styles.messageText}>{message}</CText>
          </View>
        </View >

        {(buttonOnContent && (buttonPrevText || buttonNextText)) && (
          <View style={styles.buttonContainer}>
            {buttonPrevText ? (
              <CButton
                style={styles.buttonOnContentContainer}
                onPress={onPrev}
                label={buttonPrevText}
                outline
                outlineColor={'transparent'}
              />
            ) : null }

            {buttonNextText ? (
              <CButton
                style={styles.buttonOnContentContainer}
                onPress={onNext}
                label={buttonNextText}
                outline
                outlineColor={'transparent'}
              />
            ) : null}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginBottom: 16
  },
  more: {
    fontSize: 12,
    fontFamily: Fonts.poppins,
    fontWeight: '700',
    color: Colors.tselRed,
    alignItems: 'flex-end',
  },
  close: {
    fontSize: 17,
    fontFamily: Fonts.poppins,

  },
  searchIcon: {
    width: 16,
    height: 16,
  },
  // touchable: {
  //   justifyContent: 'flex-end',
  //   marginLeft: 30
  // },
  step: {
    alignItems: 'flex-start',
    marginBottom: 7,
    fontFamily: Fonts.muli,
    fontSize: 12,
    flexDirection: 'row',
  },
  contentContainer: {
    borderWidth: 1,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginHorizontal: 26
  },
  message: {
    flex: 1
  },
  messageTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.tselDarkBlue,
    marginBottom: 8
  },
  messageText: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.tselGrey100,
    fontFamily: Fonts.muli
  },
  buttonText: {
    color: Colors.white,
    fontSize: 11,
    fontFamily: Fonts.poppinsBold
  },
  buttonOnContentContainer: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 12,
    zIndex: 10,
    backgroundColor: Colors.white
  },
  buttonOnContentBorderContainer: {
    backgroundColor: Colors.tselRed,
    paddingHorizontal: 32,
    paddingVertical: 6,
    borderRadius: 50
  },
  icon: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
    marginEnd: 16,
    marginTop: 10,
    marginBottom: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
