import React from 'react';
import { StyleSheet, Platform, View, Text } from 'react-native';

export default class CText extends React.Component {
  state = {
    isBold: Platform.select({
      ios: {
        fontFamily: "Muli-Bold"
      },
      android: {
        fontFamily: "Muli-Bold"
      },
      web: {
        fontFamily: 'Muli-Bold'
      }
    })
  }

  render() {
    const {
      style,
      inline,
      bold
    } = this.props;

    const {
      isBold
    } = this.state;

    let _bold = bold ? isBold : {}

    if (inline) {
      return (
        <Text {...this.props} style={{ ...styles.text, ...style, ..._bold }} testID={this.props.nativeID} accessibilityLabel={this.props.nativeID}  >{this.props.children}</Text>
      );
    }

    return (
      <>
        <Text {...this.props} style={{ ...styles.text, ...style, ..._bold }} testID={this.props.nativeID} accessibilityLabel={this.props.nativeID} >{this.props.children}</Text>
      </>
    );
  }
}

const styles = {
  text: {
    color: "#646464",
    fontStyle: "normal",
    ...Platform.select({
      ios: {
        fontFamily: "Muli-Regular"
      },
      android: {
        fontFamily: "Muli-Regular"
      },
      web: {
        fontFamily: 'Muli-Regular'
      }
    }),
    ...Platform.select({
      web: {
        letterSpacing: "normal"
      }
    }),
  },
};
