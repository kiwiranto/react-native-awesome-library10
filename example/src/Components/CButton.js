import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../Components/CColors";
import CText from "./CText";

export default class CButton extends React.Component {
  render() {
    const {
      txtColor,
      background,
      onPress,
      label,
      styleWrapper,
      styleProp,
      bold,
      id,
      disabled,
      styleText
    } = this.props;
    const backgroundColor = disabled ? "grey" : background || "transparent";
    const color = txtColor || colors.black;
    const btnWrapper = styleWrapper || styles.btnWrapper;
    const Bold = bold ? 'bold' : '';
    
    return (
      <View style={{ ...styles.btnWrapper, ...btnWrapper }}>
        <TouchableOpacity
          disabled={disabled}
          nativeID={id}
          style={[{ backgroundColor }, styles.btnContainer, styleProp]}
          onPress={onPress}
        >
          <View style={styles.txtContainer}>
              <CText style={{ ...styles.txtBtn, ...styleText, color: color, fontWeight:Bold }}>
              {label}
            </CText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

CButton.propTypes = {
  txtColor: PropTypes.string,
  background: PropTypes.string
};

const styles = StyleSheet.create({
  btnWrapper: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    borderRadius: 5
  },
  btnBold: {
    fontWeight:'bold'
  },
  btnContainer: {
    flex: 1,
    // height: 50
  },
  txtContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10
  }
});
