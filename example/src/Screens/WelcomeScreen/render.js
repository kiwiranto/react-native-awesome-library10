import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import Swiper from 'react-native-swiper';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import CText from '../../Components/CText';
import CButton from '../../Components/app/CButton';

import { dpi } from '../../Helper/HelperGlobal';
import { NavigateTo } from '../../Navigator/Navigator';
import { SET_ONBOARDING_PAGE } from '../../Config/Reducer';
// import { firebaseTracker, firebaseTrackerScreenName } from '../../Helper/MobileHelper';
// import { adjustTracker } from '../../Helper/Adjust';

import {
  onboardingBackground1Reskin as onboardingBackground1,
  onboardingBackground2Reskin as onboardingBackground2,
  onboardingBackground3Reskin as onboardingBackground3,
  onboardingWave1Reskin as onboardingWave1,
  onboardingWave2Reskin as onboardingWave2,
  onboardingWave3Reskin as onboardingWave3,
  onboardingPhone1Reskin as onboardingPhone1,
  onboardingPhone2Reskin as onboardingPhone2,
  onboardingPhone3Reskin as onboardingPhone3
} from '../../Assets/app/welcome';


class RenderMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    };
    this.swiperRef = swiper => (this.swiper = swiper);
  }

  componentDidMount() {
    const screenName = 'WelcomeScreen';

    // firebaseTracker('view_welcome');
    // firebaseTrackerScreenName(screenName, screenName);
    SplashScreen.hide();
  }

  _handleSkipOnboarding = () => {
    this.props.setOnboardingPage(false);
    NavigateTo('LoginLanguage', false, this.props);
  }

  render() {
    const { index } = this.state;
    const { t } = this.props;
    const widthScreen = Dimensions.get('window').width;
    const dataContent = [
      {
        title: t('Onboarding.Step1.Title'),
        subtitle: t('Onboarding.Step1.Subtitle'),
        backgroundImage: onboardingBackground1,
        phoneImage: onboardingPhone1,
        waveImage: onboardingWave1
      },
      {
        title: t('Onboarding.Step2.Title'),
        subtitle: t('Onboarding.Step2.Subtitle'),
        backgroundImage: onboardingBackground2,
        phoneImage: onboardingPhone2,
        waveImage: onboardingWave2
      },
      {
        title: t('Onboarding.Step3.Title'),
        subtitle: t('Onboarding.Step3.Subtitle'),
        backgroundImage: onboardingBackground3,
        phoneImage: onboardingPhone3,
        waveImage: onboardingWave3
      }
    ];

    return (
      <SafeAreaView style={{ ...styles.container }}>
        <Swiper
          ref={this.swiperRef}
          loop={false}
          index={index}
          onIndexChanged={e => this.setState({ index: e })}
          showsPagination={false}
          nestedScrollEnabled={true}
          removeClippedSubviews={false}
        >
          {dataContent.map((data, idx) => {
            return (
              <ScrollView key={idx} contentContainerStyle={{ flexGrow: 1 }}>
                <ImageBackground
                  source={data.backgroundImage}
                  style={styles.backgroundImage}
                  resizeMode={'cover'}
                  key={idx}
                >
                  <View style={styles.paginationContainer}>
                    {dataContent.map((dataPagination, indexPagination) => {
                      return (
                        <View
                          key={indexPagination}
                          style={idx == indexPagination ? {
                            marginLeft: indexPagination != 0 ? dpi(3) : null,
                            ...styles.paginationStyle,
                            ...styles.paginationStyleActive
                          } : {
                            ...styles.paginationStyle,
                            marginLeft: indexPagination != 0 ? dpi(3) : null
                          }}
                        />
                      );
                    })}
                  </View>

                  <View style={styles.textWrapper}>
                    <Text style={styles.textTitle}>{data.title}</Text>
                    <Text style={styles.textSubtitle}>{data.subtitle}</Text>
                  </View>

                  <View style={styles.imageWrapper}>
                    <Image
                      style={widthScreen > 360 ? styles.phoneImage : styles.phoneImageSmall}
                      source={data.phoneImage}
                      resizeMode={'contain'}
                    />

                    <ImageBackground
                      style={{ ...styles.wave, height: idx == 2 ? dpi(80) : dpi(46) }}
                      source={data.waveImage}
                      resizeMode={'contain'}
                    >
                      {idx == 2 ? (
                        <CButton
                          style={{ marginHorizontal: dpi(16), marginBottom: dpi(16) }}
                          label={t('Global.Start')}
                          onPress={() => {
                            // firebaseTracker('iSetUp_Mulai');
                            // adjustTracker('hblohy');
                            this._handleSkipOnboarding();
                          }}
                          nativeID="btn-start-onBoarding"
                        />
                      ) : (
                        <View style={{ ...styles.navigationWrapper }}>
                          <TouchableOpacity
                            onPress={() => {
                              // firebaseTracker('iSetUp_Lewati');
                              this._handleSkipOnboarding();
                            }}
                            nativeID='btn-skip'
                          >
                            <CText bold={true} style={styles.buttonNav}>{t('Global.Skip')}</CText>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              // firebaseTracker(`iSetUp_Selanjutnya${idx + 1}`);
                              this.swiper.scrollTo(idx + 1);
                            }}
                            nativeID="btn-next'"
                          >
                            <CText bold={true} style={styles.buttonNav}>{t('Global.NextCoachmark')}</CText>
                          </TouchableOpacity>
                        </View>
                      )}
                    </ImageBackground>
                  </View>
                </ImageBackground>
              </ScrollView>
            );
          })}
        </Swiper>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: dpi(14)
  },
  paginationStyle: {
    height: dpi(5),
    width: dpi(5),
    borderRadius: dpi(3),
    backgroundColor: '#ff4c47'
  },
  paginationStyleActive: {
    width: dpi(14),
    backgroundColor: '#fff'
  },
  textWrapper: {
    marginHorizontal: dpi(18)
  },
  textTitle: {
    color: '#ffffff',
    fontSize: dpi(12),
    textAlign: 'center',
    marginTop: dpi(12),
    marginBottom: dpi(8),
    fontFamily: 'TelkomselBatikSans-Bold'
  },
  textSubtitle: {
    color: '#ffffff',
    fontSize: dpi(7),
    textAlign: 'center',
    lineHeight: dpi(12),
    fontFamily: 'Poppins-Regular'
  },
  imageWrapper: {
    alignItems: 'center',
    width: '100%',
    marginTop: dpi(16)
  },
  phoneImage: {
    width: dpi(120),
    height: dpi(218)
  },
  phoneImageSmall: {
    width: dpi(120),
    height: dpi(193)
  },
  wave: {
    width: '100%',
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    justifyContent: 'flex-end'
  },
  navigationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: dpi(16),
    marginBottom: dpi(17)
  },
  buttonNav: {
    color: '#001A41',
    fontSize: dpi(6),
    lineHeight: dpi(14),
    textDecorationLine: 'underline',
    paddingVertical: dpi(4)
  },
  buttonStart: {
    flex: 1,
    backgroundColor: '#ED0226',
    paddingVertical: dpi(4)
  }
});

const mapStateToProps = state => {
  const { globalData } = state;
  return {
    globalData
  };
};

const mapDispatchToProps = dispatch => ({
  setOnboardingPage: isShow =>
    dispatch({
      type: SET_ONBOARDING_PAGE,
      data: isShow
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RenderMobile));
