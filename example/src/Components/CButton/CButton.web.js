import React from "react";
import { View, TouchableOpacity } from 'react-native';

import(/* webpackPrefetch: true */ "./style.css")

import CText from "../CText";

/**
 * props : 
 * @property onClick - func
 * @property buttonText - string
 * @property buttonType - string : coral, 
 */
export default class CButton extends React.Component {
  render() {
    const buttonType = this.props.buttonType;

    return (
      <React.Fragment>
        <TouchableOpacity
          onClick={this.props.onClick}
          class={"button-wrapper-" + buttonType}
          style={this.props.style}
        >
          <View class={"button-text-" + buttonType}>
            <CText>
              {this.props.buttonText}
            </CText>
          </View>
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}
