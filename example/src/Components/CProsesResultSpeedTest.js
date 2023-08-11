import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Clipboard,
  ToastAndroid
} from "react-native";

import { NavigateTo } from "../Navigator/Navigator";
import { iconCopyText, iconKey } from '../Assets/app/shared';
import { iconModem } from "../Assets/app/wifi-setup";
import CText from './app/CText';
import CButton from './app/CButton';
import { connect } from "react-redux";
import analytics from '@react-native-firebase/analytics';

class PairingTurnOn extends Component {
  constructor(props) {
    super(props);
  }

  writeToClipboard = async () => {
    const { modemData } = this.props
    await Clipboard.setString("attributes" in modemData && "ssid" in modemData.attributes ? modemData.attributes.ssid : "-");
    ToastAndroid.showWithGravity(
      "Copied to Clipboard",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM
    );
  };

  componentDidMount() {
    const {
      status,
    } = this.props;

    if (status == "SUCCESS") {
      var date = new Date();
      let currentTime =
        date.getDate() +
        "/" +
        parseInt(date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " + date.getHours() + "/" + date.getMinutes();

      analytics().logEvent(
        "setupResult", {
        pairingStatus: "optimal",
        startTime: currentTime,
      })
    }else{
      var date = new Date();
      let currentTime =
        date.getDate() +
        "/" +
        parseInt(date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " + date.getHours() + "/" + date.getMinutes();

      analytics().logEvent(
        "setupResult", {
        pairingStatus: "belum optimal",
        startTime: currentTime,
      })
    }

  }

  _handleNavigation = navName => {
    NavigateTo(navName, false, this.props);
  };

  render() {
    const SUCCESS = "SUCCESS";
    const FAILED = "FAILED";
    const FAILED_OTHER = "FAILED_OTHER";

    const {
      iconResult,
      title,
      subtitle,
      status,
      buttonPrimaryTitle,
      handleButtonPrimaryTitle,
      buttonSecondaryTitle,
      handleSecondaryButton,
      modemData,
      t
    } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.BottomContainer}>
            <View
              style={
                status === SUCCESS
                  ? styles.imageContainer
                  : styles.imageContainerSecond
              }
            >
              <Image source={iconResult} style={styles.imageStatus} />
            </View>
            <View style={styles.contentContainer}>
              <CText bold={true} style={styles.titleText}>
                {title}
              </CText>
              <CText style={styles.subtitle}>{subtitle}</CText>

              {status === FAILED && (
                <View style={{ marginTop: 26 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                        backgroundColor: "red"
                      }}
                    />
                    <CText style={{ marginLeft: 17 }}>
                      {/* Ke tempat yang lebih tinggi. */}
                      {t("PairingProcessScreen.CProsesResultSpeedTest.Failed.NoteList1")}
                    </CText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                        backgroundColor: "red"
                      }}
                    />
                    <CText style={{ marginLeft: 17 }}>
                      {/* Tidak terhalang objek besar. */}
                      {t("PairingProcessScreen.CProsesResultSpeedTest.Failed.NoteList2")}
                    </CText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                        backgroundColor: "red"
                      }}
                    />
                    <CText style={{ marginLeft: 17 }}>
                      {/* Dekat dengan jendela */}
                      {t("PairingProcessScreen.CProsesResultSpeedTest.Failed.NoteList3")}
                    </CText>
                  </View>
                </View>
              )}
            </View>

            {status === SUCCESS && (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  alignItems: "center",
                  marginTop: 40
                }}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.cardResult}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 16,
                        paddingTop: 16,
                        paddingBottom: 8
                      }}
                    >
                      <Image
                        source={iconModem}
                        style={{ width: 24, height: 24 }}
                      />
                      <View style={{ paddingLeft: 16 }}>
                        <CText>
                          {/* Nama Wifi */}
                          {t("PairingProcessScreen.CProsesResultSpeedTest.Success.WifiNameLabel")}
                        </CText>
                        <CText style={{ color: "#1a1a1a", fontSize: 16 }}>
                          {"attributes" in modemData && "ssid" in modemData.attributes ? modemData.attributes.ssid : "-"}
                        </CText>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 16
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <Image
                          source={iconKey}
                          style={{ width: 24, height: 24 }}
                        />
                        <View style={{ paddingLeft: 16 }}>
                          <CText>
                            {/* Password Wifi */}
                            {t("PairingProcessScreen.CProsesResultSpeedTest.Success.WifiPasswordLabel")}
                          </CText>
                          <CText style={{ color: "#1a1a1a", fontSize: 16 }}>
                            {"attributes" in modemData && "password" in modemData.attributes ? modemData.attributes.password : "-"}
                          </CText>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          this.writeToClipboard();
                        }}
                      >
                        <Image
                          source={iconCopyText}
                          resizeMode={"contain"}
                          style={{ width: 24, weight: 24 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View
              style={{
                flexDirection: "column",
                width: "100%",
                justifyContent: "flex-end",
                alignContent: "flex-end",
                paddingHorizontal: 24
              }}
            >
              {buttonPrimaryTitle && (
                <CButton
                  styleWrapper={{
                    marginHorizontal: 16,
                    flexDirection: "row",
                    marginBottom: 6
                  }}
                  styleProp={{
                    borderRadius: 20,
                    height: 40
                  }}
                  styleTextContainer={{ marginVertical: 0 }}
                  styleBtn={{ fontSize: 16 }}
                  txtColor={"#ffffff"}
                  bold={true}
                  background={"#ff4c47"}
                  label={buttonPrimaryTitle}
                  onPress={handleButtonPrimaryTitle}
                />
              )}

              {buttonSecondaryTitle && (
                <View style={{ paddingTop: 16 }}>
                  <CButton
                    styleTextContainer={{ marginVertical: 0 }}
                    styleBtn={{ fontSize: 16 }}
                    txtColor="#ED0226"
                    bold
                    outline
                    outlineColor="#ED0226"
                    label={buttonSecondaryTitle}
                    onPress={handleSecondaryButton}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { modemData } = state;
  return {
    modemData
  };
};

export default connect(mapStateToProps)(PairingTurnOn);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  header: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 15
  },
  arrowIcon: {
    width: 24,
    height: 24
  },
  imageStatus: {
    width: 120,
    height: 120
  },
  BottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 24
  },
  imageContainerSecond: {
    alignItems: "center",
    paddingTop: 140,
    // paddingBottom: 64
  },
  contentContainer: {
    alignItems: "center"
  },
  titleText: {
    fontSize: 18,
    color: "#1a1a1a",
    marginBottom: 16
  },
  subtitle: {
    width: 343,
    textAlign: "center",
    fontSize: 16,
    color: "#1a1a1a"
  },
  conectedContainer: {
    marginTop: 16
  },
  conectedDevice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24
  },
  connectedText: {
    fontSize: 12,
    color: "#646464",
    marginLeft: 16
  },
  buttonAjakTeman: {
    marginTop: 16,
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center"
  },
  cardResult: {
    width: 343,
    height: 144,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5
  }
});
