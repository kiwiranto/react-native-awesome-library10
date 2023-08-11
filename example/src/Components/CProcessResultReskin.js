import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import analytics from '@react-native-firebase/analytics';

import { NavigateTo } from '../Navigator/Navigator';
import CText from './app/CText';
import CButton from './app/CButton';
import CButtonApp from './CButtonApp';
import { Colors, Fonts } from './app/CThemes';

const SUCCESS = 'SUCCESS';
export default class CProcessResultReskin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 60,
      isDisabled: false
    };
  }

  _handleNavigation = navName => {
    NavigateTo(navName, false, this.props);
  };

  componentDidMount() {
    const { status, timer } = this.props;

    if (status == SUCCESS) {
      var date = new Date();
      let currentTime =
        date.getDate() +
        '/' +
        parseInt(date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' ' + date.getHours() + '/' + date.getMinutes();

      analytics().logEvent(
        'pairingComplete', {
        pairingStatus: 'success',
        startTime: currentTime
      });
    }

    if (timer) {
      this.setState({
        isDisabled: true,
        time: 60
      });
    }
  }

  render() {
    const {
      iconResult,
      title,
      subtitle,
      status,
      buttonPrimaryTitle,
      handleButtonPrimaryTitle,
      buttonSecondaryTitle,
      handleSecondaryButton,
      isLoading,
      timer,
      reportOption,
      reportAction,
      t
    } = this.props;
    const { time, isDisabled } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.contentContainer}>
            <View style={styles.innerContainer}>
              <Image
                source={iconResult}
                style={styles.imageStatus}
              />

              <View>
                <CText
                  children={title}
                  style={styles.titleText} />

                <CText
                  children={subtitle}
                  style={styles.subtitle}
                />
              </View>
            </View>

            <View style={styles.buttonWrapper}>
              {buttonPrimaryTitle && (
                <CButton
                  bottom={16}
                  loading={isLoading}
                  disabled={isDisabled}
                  time={time}
                  showTimer={(timer && isDisabled) ? true : false}
                  timerBracket={true}
                  onFinishTimer={() => {
                    this.setState({
                      isDisabled: false
                    });
                  }}
                  label={(timer && isDisabled) ? '' : buttonPrimaryTitle}
                  onPress={handleButtonPrimaryTitle}
                  nativeID={'btn-success-change-ssid-and-password'}
                />
              )}

              {buttonSecondaryTitle && (
                <CButtonApp
                  outline
                  label={buttonSecondaryTitle}
                  onPress={handleSecondaryButton}
                />
              )}

              {status != SUCCESS && reportOption && (
                <View style={styles.reportOption}>
                  <CText
                    children={t('Global.Or').toLowerCase()}
                    style={styles.textReport} />

                  <TouchableOpacity
                    testID={'btn-success-send-feedback'}
                    accessibilityLabel={'btn-success-send-feedback'}
                    style={{ marginLeft: 4 }}
                    onPress={() => {
                      if (reportAction && typeof reportAction == 'function') {
                        reportAction();
                      }
                    }}
                  >
                    <CText style={{ ...styles.textReport, color: Colors.tselRed, textDecorationLine: 'underline' }}>
                      {t('PairingProcessScreen.FailedMaxLimit.ButtonActionReport')}
                    </CText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginTop: 96,
    marginBottom: 52
  },
  imageStatus: {
    width: 128,
    height: 128,
    marginBottom: 32
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  titleText: {
    fontSize: 20,
    color: '#001A41',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#4E5764',
    fontFamily: 'Poppins-Regular'
  },
  conectedContainer: {
    marginTop: 16,
    marginHorizontal: 38
  },
  conectedDevice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24
  },
  connectedText: {
    fontSize: 12,
    color: '#646464',
    marginLeft: 16
  },
  buttonWrapper: {
    width: '100%',
    paddingBottom: 14
  },
  buttonAjakTeman: {
    marginTop: 16,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardResult: {
    width: '100%',
    backgroundColor: 'red'
  },
  reportOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  textReport: {
    fontSize: 10,
    fontFamily: Fonts.poppinsBold,
    lineHeight: 16
  }
});
