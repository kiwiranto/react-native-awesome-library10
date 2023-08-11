import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { store } from "../Config/Store";
import { dpi } from "../Helper/HelperGlobal";
import { withTranslation } from "react-i18next";
import CColors from "./CColors";

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
      iconCloseButton,
      closeButton,
      isTselPoint,
      isTselPointUse,
      isParamsTselPoint,
      isButtonVertical,
      leftAlign
    } = this.props;
    const language = store.getState().language

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
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              position: "absolute",
              paddingHorizontal: 12
            }}
          >
            <View style={leftAlign ? {...Styles.modal, alignItems:'flex-start'} : Styles.modal}>
              <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={closeButton}>
                <Image source={iconCloseButton} style={{width:16, height:16, marginRight:10}} resizeMode='cover' />
              </TouchableOpacity>
              {iconModal && (
                <Image
                  source={iconModal}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
              )}
              <Text
                style={
                  leftAlign
                    ? { ...Styles.titleModal, marginTop: -12, textAlign: "left" }
                    : Styles.titleModal
                }
              >
                {title}
              </Text>
              {subtitle2 ?
                <>
                  <Text style={{ ...Styles.fontMuli, ...Styles.subtitleModal }}>
                    {subtitle}
                  </Text>
                  <Text style={{ ...Styles.fontMuli, ...Styles.subtitleModal, fontSize: 10 }}>
                    {subtitle2}
                  </Text>
                </> :
                <>
                  {isTselPointUse ?
                  <View style={{ width: '100%' }}>
                    {language === 'id' ?
                    <Text>
                      Apakah Anda ingin menggunakan <Text style={Styles.muliBold}>{isParamsTselPoint.point} poin</Text> untuk mendapatkan paket data ini?
                    </Text> :
                    <Text>
                      Would you like to use <Text style={Styles.muliBold}>{isParamsTselPoint.point} poin</Text> to get this data package?
                    </Text>
                  }
                  </View> :
                    isTselPoint ?
                      <View style={{ width: '100%' }}>
                          {language === 'id'
                            ? <Text style={{ ...Styles.fontMuli, textAlign: 'center'}}>
                                Anda telah menggunakan <Text style={Styles.muliBold}>{isParamsTselPoint.point} poin </Text> 
                                {isParamsTselPoint.coupons?.tag === 'Undi Poin' || isParamsTselPoint.coupons?.tag === 'Draw Poin' ? `` : <Text>untuk mendapatkan <Text style={Styles.muliBold}>{isParamsTselPoint.title}</Text></Text>}, sisa poin Anda sekarang adalah 
                                <Text style={Styles.muliBold}> {isParamsTselPoint.totalPoin - isParamsTselPoint.point} poin.</Text></Text>
                            : <Text style={{ ...Styles.fontMuli, textAlign: 'center'}}>
                                You have used <Text style={Styles.muliBold}>{isParamsTselPoint.point} poin </Text> 
                                {isParamsTselPoint.coupons?.tag === 'Undi Poin' || isParamsTselPoint.coupons?.tag === 'Draw Poin' ? `` : <Text>to get a <Text style={Styles.muliBold}>{isParamsTselPoint.title}</Text></Text>}, your remaining poin are now  
                                <Text style={Styles.muliBold}> {isParamsTselPoint.totalPoin - isParamsTselPoint.point} poin.</Text>
                              </Text> 
                          }
                      </View> :
                      <Text
                        style={
                          leftAlign
                            ? {
                              ...Styles.fontMuli,
                              ...Styles.subtitleModal,
                              textAlign: "left",
                            }
                            : { ...Styles.fontMuli, ...Styles.subtitleModal }
                        }
                      >
                        {subtitle}
                      </Text>
                  }
                </>
                }

              {twoButtons ? (
                <View
                  style={{
                    justifyContent: 'space-around',
                    flexDirection: isButtonVertical ? 'column-reverse' : 'row',
                    // width: isButtonVertical ? 0 : '100%'
                  }}
                >
                  <TouchableOpacity
                    onPress={secondButtonOnPress}
                    disabled={isLoading}
                    style={!leftAlign && { marginRight: 8 }}
                  >
                    <Text
                      style={
                        isButtonVertical
                          ? {
                            ...Styles.fontMuli,
                            ...Styles.buttonModalClose,
                            color: "#ED0226",
                            borderColor: "#ED0226",
                          }
                          : { ...Styles.fontMuli, ...Styles.buttonModalClose }
                      }
                    >
                      {labelSecond || (language === "en" ? "Cancel" : "Batal")}
                    </Text>
                  </TouchableOpacity>
                  {/* <View style={{ width: 40 }}></View> */}
                  {isLoading ? (
                    <TouchableOpacity style={isButtonVertical ? Styles.buttonModalInActiveVertical : Styles.buttonModalInActive} disabled>
                      <ActivityIndicator />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={firstButtonOnPress}>
                      <Text
                        style={
                          isButtonVertical
                            ? {
                              ...Styles.muliBold,
                              ...Styles.buttonModal,
                              width: '100%',
                              paddingHorizontal: '38%'
                            }
                            : { ...Styles.muliBold, ...Styles.buttonModal }
                        }
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                  isLoading ?
                    <TouchableOpacity style={Styles.buttonModalInActive} disabled={true}>
                      <ActivityIndicator />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={firstButtonOnPress} style={{ width: '100%'}}>
                      <Text style={{ ...Styles.fontMuli, ...Styles.buttonModal }}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                )}

              {limitHitNiknok || limitHitNiknok == 0 ?
                <Text style={{ ...Styles.fontMuli, ...Styles.limitHitNiknok }}>
                  {t("CModal.limit")} : <Text style={{ ...Styles.muliBold, ...Styles.limitHitNiknokValue }}>{limitHitNiknok} {t("CModal.time")}</Text>
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
    width: "100%",
    maxWidth: 350,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24
  },
  titleModal: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginTop: 24,
    color: "#1a1a1a"
  },
  subtitleModal: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: dpi(12),
    textAlign: "center",
    color: '#1a1a1a',
    fontFamily: 'Poppins',
  },
  buttonModalClose: {
    height: 48,
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 14,
    color: "#0050AE",
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 109,
    textAlign: "center",
    borderRadius: 30,
    borderWidth: 2,
    overflow: 'hidden',
    borderColor: '#0050AE',
    fontFamily: 'Poppins'
  },
  buttonModal: {
    height: 48,
    alignContent: 'center',
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 16,
    backgroundColor: CColors.tselRed,
    minWidth: 109,
    textAlign: "center",
    borderRadius: 30,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: 'transparent',
    fontWeight: 'bold'
  },
  buttonModalInActive: {
    height: 48,
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 9,
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#cccccc",
    minWidth: 109,
    textAlign: "center",
    borderRadius: 20,
    width: '100%',
  },
  buttonModalInActiveVertical: {
    height: 48,
    marginTop: 24,
    paddingHorizontal: '50%',
    paddingVertical: 9,
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#cccccc",
    minWidth: 109,
    textAlign: "center",
    borderRadius: 20,
    width: '100%',
  },
  limitHitNiknok: {
    marginTop: 16,
    paddingHorizontal: 24,
    fontSize: 12,
    textAlign: "center",
    color: "#646464"
  },
  limitHitNiknokValue: {
    fontSize: 12,
    color: CColors.tselRed
  },
  fontMuli: {
    // fontFamily: "TelkomselBatikSans-Regular",
    fontFamily: "Poppins-Regular",
  },
  fontColor: {
    color: '#0050AE'
  },
  muliBold: {
    fontFamily: "Poppins-Bold",
  }
});
