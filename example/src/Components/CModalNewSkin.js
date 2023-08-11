import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { store } from '../Config/Store';
import { dpi } from '../Helper/HelperGlobal';
import { withTranslation } from 'react-i18next';
// import { iconCloseRound } from '../Assets/app/shared';

class CModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const {
      t,
      label,
      title,
      subtitle,
      subtitle2,
      iconModal,
      twoButtons,
      labelSecond,
      firstButtonOnPress,
      secondButtonOnPress,
      isLoading,
      limitHitNiknok,
      nativeId,
      nativeIdSecond,
      leftAlign,
      customDescription
    } = this.props;
    const language = store.getState().language;

    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.visible}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              position: 'absolute',
            }}
          >
            <View style={Styles.modal}>

              {/* <TouchableOpacity onPress={secondButtonOnPress} style={Styles.iconCloseContainer}>
                <Image source={iconCloseRound} style={Styles.iconClose} resizeMode={'contain'} />
              </TouchableOpacity> */}

              {
                iconModal &&
                <Image source={iconModal} style={{ width: 100, height: 100, marginTop: 32 }} resizeMode={'contain'} />

              }
              <Text style={Styles.titleModal}>{title}</Text>

              {customDescription || <Text style={ leftAlign ? { ...Styles.fontMuli, ...Styles.subtitleModal, textAlign: "left" }: { ...Styles.fontMuli, ...Styles.subtitleModal }}> {subtitle} </Text>}
              
              {twoButtons ? (
                <View
                  style={{
                    justifyContent: 'space-around',
                    flexDirection: 'column-reverse',
                  }}
                >
                  <TouchableOpacity
                    testID={nativeIdSecond}
                    accessibilityLabel={nativeIdSecond}
                    onPress={secondButtonOnPress}
                    disabled={isLoading}
                    style={{ marginRight: 8 }}
                  >
                    <Text style={{ ...Styles.fontMuli, ...Styles.buttonModalClose }}>
                      {labelSecond
                        ? labelSecond
                        : language == 'en'
                          ? 'Cancel'
                          : 'Batal'
                      }
                    </Text>
                  </TouchableOpacity>
                  {/* <View style={{ width: 40 }}></View> */}
                  {isLoading ?
                    <TouchableOpacity style={Styles.buttonModalInActive} disabled={true}>
                      <ActivityIndicator />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={firstButtonOnPress} testID={nativeId} accessibilityLabel={nativeId}>
                      <Text style={{ ...Styles.muliBold, ...Styles.buttonModal }}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  }
                </View>
              ) : (
                isLoading ?
                  <TouchableOpacity style={Styles.buttonModalInActive} disabled={true}>
                    <ActivityIndicator />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={firstButtonOnPress}>
                    <Text style={{ ...Styles.fontMuli, ...Styles.buttonModal }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
              )}

              {limitHitNiknok || limitHitNiknok == 0 ?
                <Text style={{ ...Styles.fontMuli, ...Styles.limitHitNiknok }}>
                  {t('CModal.limit')} : <Text style={{ ...Styles.muliBold, ...Styles.limitHitNiknokValue }}>{limitHitNiknok} {t('CModal.time')}</Text>
                </Text> : null
              }
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default (withTranslation()(CModal));

const Styles = StyleSheet.create({
  iconCloseContainer: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  iconClose: {
    width: 40,
    height: 40,
    
  },
  modal: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
  },
  titleModal: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginTop: 32,
    marginBottom: 16,
    color: '#001A41'
  },
  subtitleModal: {
    fontSize: 14,
    lineHeight: dpi(12),
    textAlign: 'center',
    width: 300,
    color: '#001A41',
    marginBottom: 48
  },
  buttonModalClose: {
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 9,
    width: 322,
    color: 'rgba(237, 2, 38, 1)',
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 20,
    borderColor: 'rgba(237, 2, 38, 1)',
    borderWidth: 1,
    fontWeight: 'bold'
  },
  buttonModal: {
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 9,
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#ED0226',
    width: 322,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    borderColor: 'transparent',
    fontWeight: 'bold'
  },
  buttonModalInActive: {
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 9,
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#cccccc',
    minWidth: 322,
    textAlign: 'center',
    borderRadius: 20,
    width: '100%'
  },
  limitHitNiknok: {
    marginTop: 16,
    paddingHorizontal: 24,
    fontSize: 12,
    textAlign: 'center',
    color: '#646464'
  },
  limitHitNiknokValue: {
    fontSize: 12,
    color: '#ED0226'
  },
  fontMuli: {
    fontFamily: 'Poppins-Regular',
  },
  muliBold: {
    fontFamily: 'Poppins-Bold',
  }
});
