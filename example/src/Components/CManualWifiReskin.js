import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Clipboard,
  ActivityIndicator
} from 'react-native';

import {
  bgPhoneReskin
} from '../Assets/app/tutorial-manual-wifi';
import {
  iconCopyTextRevamp,
  iconKeyReskin,
  iconModemReskin,
  bgHeadset,
  bgExclamation
} from '../Assets/app/shared';
import { ToastHandler } from '../Helper/MobileHelper';
import { dpi } from '../Helper/HelperGlobal';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { postTicket } from '../Helper/ActionGlobal';
import CTextApp from './CTextApp';
import { Colors } from './app/CThemes';
import CButtonApp from './CButtonApp';
import CModal from './app/CModal';


class CManualWifi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressActive: 1,
      status: false,
      ssid: '',
      statusModal: '',
      isLoading: false,
      modalVisible: false
    };
  }

  writeToClipboard = async () => {
    const { modemData } = this.props;
    await Clipboard.setString(modemData.attributes.password);
    ToastHandler('Copied to Clipboard');
  };

  _handlerPostTicket = async () => {
    this.setState({
      isLoading: true
    });

    const { memberData } = this.props;
    const {
      fullname,
      emailAccount,
      facebookAccount,
      googleAccount
    } = memberData?.data?.data?.attributes;

    const result = await postTicket(
      true,
      memberData ? fullname : '',
      emailAccount ? emailAccount
        : facebookAccount ? facebookAccount
          : googleAccount ? googleAccount
            : '',
      'Provisioning Failed',
      'Provisioning Failed, please check respon from Provisioning',
      'komplain',
      'activation__informasi_registrasi_nik/nok',
      memberData ? fullname : '',
      false,
      false,
      false,
    );

    console.log('>>>>>postTicket', result);
    this.setState({
      isLoading: false,
      statusModal: result ? 'success' : 'fail'
    });
    this._handlerSetModalVisible(true);
  }

  _handlerSetModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  _handlerData = () => {
    const { statusModal } = this.state;
    const { t } = this.props;
    const statusSuccess = (statusModal === 'success');
    let icon, title, description, labelAccept;

    statusSuccess ? (
      icon = bgHeadset,
      title = t('PairingProcessScreen.PopupReportSuccess.Title'),
      description = t('PairingProcessScreen.PopupReportSuccess.Desc'),
      labelAccept = t('PairingProcessScreen.PopupReportSuccess.ButtonAction')
    ) : (
      icon = bgExclamation,
      title = t('PairingProcessScreen.PopupReportFailed.Title'),
      description = t('PairingProcessScreen.PopupReportFailed.Desc'),
      labelAccept = t('PairingProcessScreen.PopupReportFailed.ButtonAction')
    );

    return { icon, title, description, labelAccept };
  }

  _handlerModal = () => {
    const { modalVisible } = this.state;
    const data = this._handlerData();

    return (
      <View>
        {modalVisible && (
          <CModal
            visible={modalVisible}
            icon={data.icon}
            title={data.title}
            description={data.description}
            labelAccept={data.labelAccept}
            onPressAccept={() => { this._handlerSetModalVisible(false); }}
          />
        )}
      </View>
    );
  }

  render() {
    const {
      modemData,
      t,
      onPress,
      secondOnPress
    } = this.props;
    const { isLoading } = this.state;
    const modal = this._handlerModal();

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={bgPhoneReskin}
              style={styles.headerImage}
            />
            <CTextApp style={styles.headerTitle}>
              {t('PairingProcessScreen.ManualConnect.Title')}
            </CTextApp>
            <CTextApp style={styles.headerDesc}>
              {t('PairingProcessScreen.ManualConnect.Subtitle')}
            </CTextApp>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldNameContainer}>
              <Image
                source={iconModemReskin}
                style={styles.fieldIcon}
              />
              <View style={styles.fieldTextContainer}>
                <CTextApp style={styles.fieldTitle}>
                  {t('TutorialManualWifi.Step3Ssid')}
                </CTextApp>

                <CTextApp style={styles.fieldDescription}>
                  {modemData.attributes.ssid}
                </CTextApp>
              </View>
            </View>

            <View style={styles.fieldPasswordContainer} >
              <View style={styles.fieldPasswordContent} >
                <Image
                  source={iconKeyReskin}
                  style={styles.fieldIcon}
                />

                <View style={styles.fieldTextContainer}>
                  <CTextApp style={styles.fieldTitle}>
                    {t('TutorialManualWifi.Step3Password')}
                  </CTextApp>

                  <CTextApp style={styles.fieldDescription}>
                    {modemData.attributes.password}
                  </CTextApp>
                </View>
              </View>

              <TouchableOpacity
                style={styles.fieldPasswordContent}
                onPress={() => {
                  this.writeToClipboard();
                }}
              >
                <Image
                  source={iconCopyTextRevamp}
                  resizeMode={'contain'}
                  style={styles.fieldIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <CButtonApp
              style={styles.buttonConfirm}
              label={t('PairingProcessScreen.ManualConnect.ButtonAction')}
              onPress={() => { onPress(); }}
            />

            <CButtonApp
              outline
              label={t('PairingProcessScreen.ManualConnect.ButtonAction2')}
              onPress={() => { secondOnPress(); }}
            />
          </View>

          {modal}
        </View>

        {isLoading &&
          <View style={styles.loaderMask}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size={50} color={Colors.tselRed} />
            </View>
          </View>
        }
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { modemData, memberData } = state;
  return {
    modemData,
    memberData
  };
};

export default connect(mapStateToProps)(withTranslation()(CManualWifi));

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: dpi(8),
    height: '100%',
    flex: 1,
    paddingBottom: dpi(8)
  },
  contentContainerTitle: {
    fontSize: dpi(10)
  },
  contentContainerDesc: {
    fontSize: dpi(8),
    textAlign: 'center',
    marginTop: dpi(4),
    marginHorizontal: dpi(12)
  },
  headerContainer: {
    marginTop: dpi(20),
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: dpi(13)
  },
  headerImage: {
    width: dpi(50),
    height: dpi(80)
  },
  headerTitle: {
    marginTop: dpi(12),
    fontSize: dpi(12),
    textAlign: 'center',
    fontFamily: 'TelkomselBatikSans-Bold',
    lineHeight: dpi(16)
  },
  headerDesc: {
    marginTop: dpi(8),
    width: '95%',
    fontSize: dpi(7),
    textAlign: 'center',
    color: Colors.tselGrey100
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    borderRadius: dpi(6),
    padding: dpi(8),
    backgroundColor: Colors.tselCardBackground,
    marginBottom: dpi(13)
  },

  // Field Name
  fieldNameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: dpi(12)
  },
  fieldIcon: {
    width: dpi(12),
    height: dpi(12),
    resizeMode: 'contain',
    marginBottom: dpi(2)
  },
  fieldTextContainer: {
    paddingLeft: 16
  },
  fieldTitle: {
    fontSize: dpi(6),
    color: Colors.tselGrey80,
    marginBottom: dpi(6)
  },
  fieldDescription: {
    fontSize: dpi(7)
  },

  // Field Password
  fieldPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  fieldPasswordContent: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },

  buttonContainer: {
    flex: 1
  },
  buttonConfirm: {
    marginBottom: dpi(8)
  },

  // Loader
  loaderMask: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(255,255,255,0.85)'
  },
  loaderContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,1)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.15,
    shadowRadius: 5
  }
});
