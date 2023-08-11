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
      nativeID
    } = this.props;
    const language = store.getState().language;

    // console.log("limitHitNiknok-", limitHitNiknok);
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
              paddingHorizontal: 12
            }}
          >
            <View style={Styles.modal}>
              <Image source={iconModal} style={{ width: 100, height: 100 }} resizeMode={'contain'} />
              <Text style={Styles.titleModal}>{title}</Text>
              {subtitle2 ?
                <>
                  <Text style={{ ...Styles.fontMuli, ...Styles.subtitleModal }}>
                    {subtitle}
                  </Text>
                  <Text style={{ ...Styles.fontMuli, ...Styles.subtitleModal, fontSize: 10 }}>
                    {subtitle2}
                  </Text>
                </> :
                <Text style={{ ...Styles.fontMuli, ...Styles.subtitleModal }}>
                  {subtitle}
                </Text>}

              {twoButtons ? (
                <View
                  style={{
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity onPress={secondButtonOnPress} disabled={isLoading} style={{ marginRight: 8 }}>
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
                    <TouchableOpacity onPress={firstButtonOnPress} nativeID={nativeID}>
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
  modal: {
    width: '100%',
    maxWidth: 350,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16
  },
  titleModal: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Muli-Bold',
    marginTop: 24,
    color: '#1a1a1a'
  },
  subtitleModal: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: dpi(12),
    textAlign: 'center',
    color: '#1a1a1a'
  },
  buttonModalClose: {
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 9,
    color: '#646464',
    fontSize: 16,
    minWidth: 109,
    textAlign: 'center',
    borderRadius: 20,
  },
  buttonModal: {
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 9,
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#ff4c47',
    minWidth: 109,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: 'transparent'
  },
  buttonModalInActive: {
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 9,
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#cccccc',
    minWidth: 109,
    textAlign: 'center',
    borderRadius: 20,
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
    color: '#ff4c47'
  },
  fontMuli: {
    fontFamily: 'Muli-Regular',
  },
  muliBold: {
    fontFamily: 'Muli-Bold',
  }
});
