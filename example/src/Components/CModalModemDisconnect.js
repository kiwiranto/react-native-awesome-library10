import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Dimensions} from "react-native";

import {
  iconModemFail,
  iconPhoneSilver,
  iconModemGrey,
  iconStatistic,
  iconUserGrey,
  iconSignalGrey
} from '../Assets/app/modem-disconnect'
import CText from "./CText";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class CModalModemDisconnect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { modemData, t } = this.props;
    let isDevice = Dimensions.get('window').width <= 384;

    return (
      <View style={styles.container}>
        <View style={styles.lineTop} />
        <Image
          source={iconModemFail}
          style={{ width: isDevice? 110 : 120, height: isDevice? 110 : 120, marginTop: isDevice? 20 : 32 }}
        />
        <View style={{ width: 302, marginVertical: 24 }}>
          <CText bold={true} style={styles.titleModal}>
            {t("ModemDisconectModal.Title")} {modemData && "attributes" in modemData ? modemData.attributes.ssid : ""}
          </CText>
        </View>
        <View>
          <CText style={styles.subtitleModal}>
            {t("ModemDisconectModal.Desc")} {modemData && "attributes" in modemData ? modemData.attributes.ssid : ""}
          </CText>
        </View>
        <View style={{ marginTop: isDevice? 15 :24 }}>
          <View style={styles.subtitleContainer}>
            <Image
              source={iconSignalGrey}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
            <CText style={styles.titleIcon}>
              {t("ModemDisconectModal.List1")}
            </CText>
          </View>
          <View style={styles.subtitleContainer}>
            <Image source={iconPhoneSilver} style={{ width: 24, height: 24 }} />
            <CText style={styles.titleIcon}>
              {t("ModemDisconectModal.List2")}
            </CText>
          </View>
          <View style={styles.subtitleContainer}>
            <Image source={iconModemGrey} style={{ width: 24, height: 24 }} />
            <CText style={styles.titleIcon}>
              {t("ModemDisconectModal.List3")}
            </CText>
          </View>
          <View style={styles.subtitleContainer}>
            <Image source={iconUserGrey} style={{ width: 24, height: 24 }} />
            <CText style={styles.titleIcon}>
              {t("ModemDisconectModal.List4")}
            </CText>
          </View>
          <View style={styles.subtitleContainer}>
            <Image source={iconStatistic} style={{ width: 24, height: 24 }} />
            <CText style={styles.titleIcon}>
              {t("ModemDisconectModal.List5")}
            </CText>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { modemData } = state;
  return {
    modemData
  };
};

export default connect(
  mapStateToProps
)(withTranslation()(CModalModemDisconnect));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    paddingHorizontal: 24,
  },
  lineTop: {
    width: 200,
    height: 3,
    backgroundColor: "#b0b0b0",
    marginTop: 8,
  },
  titleModal: {
    fontSize: 20,
    textAlign: "center",
    color: "#1a1a1a",
    lineHeight: 24,
  },
  subtitleContainer: {
    flexDirection: "row",
    width: "75%",
    height: 32,
    alignItems: "center",
    marginBottom: 15,
  },
  subtitleModal: {
    fontSize: 16,
    textAlign: "center",
    color: "#1a1a1a",
    lineHeight: 24,
  },
  titleIcon: {
    marginLeft: 16,
    fontSize: 12,
    color: "#646464",
  },
});
