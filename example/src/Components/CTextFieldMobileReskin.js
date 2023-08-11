import React, { Component } from 'react';
import {
  View,
  TextInput,
  Animated,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { iconEyeCLoseMobileReskin, iconEyeOpenMobileReskin } from '../Assets/app/text-field';
import CColors from './CColors';

export default class CTextFieldMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      isSecureEntry: false,
      needSecureEntry: false
    };

    this._animatedIsFocused = new Animated.Value(
      this.props.value === '' ? 0 : 1
    );
  }

  componentDidMount() {
    if (this.props.secureTextEntry != undefined) {
      this.setState({
        isFocused: false,
        isSecureEntry: this.props.secureTextEntry,
        needSecureEntry: true
      });
    }
  }

  handleFocus = () => this.setState({ isFocused: true });

  handleBlur = () => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
      duration: 200
    }).start();
  }

  render() {
    const { label, styleInput, isvalid, errorMessage, ...props } = this.props;
    const fontDefault = styleInput.fontSize || 16;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      zIndex: -1,
      fontFamily: 'Poppins-Regular',
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [7, -20]
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [fontDefault, 12]
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [CColors.tselDarkBlue, CColors.grey80]
      })
    };
    const errorMessageText = errorMessage ? (
      <Text
        style={{
          marginTop: 5,
          marginBottom: 20,
          fontFamily: 'Poppins-Regular',
          fontSize: 13,
          color: '#e53131'
        }}
      >
        {errorMessage}
      </Text>
    ) : null;
    return (
      <View style={{ paddingTop: 18, flex: 1 }}>
        <View style={{ position: 'relative' }}>
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <TextInput
            {...props}
            style={{
              paddingRight: this.state.needSecureEntry ? 30 : null,
              fontFamily: 'Poppins-Regular',
              fontSize: fontDefault,
              color: '#000',
              borderBottomWidth: 1,
              borderBottomColor: isvalid ? '#646464' : CColors.tselRed,
              ...styleInput
            }}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            secureTextEntry={this.state.isSecureEntry}
            blurOnSubmit
            editable={this.props.editable}
            nativeID={this.props.nativeID}
          />
          {this.state.needSecureEntry && (
            <TouchableOpacity
              style={{
                width: 24,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 0,
                bottom: '55%'
              }}
              onPress={() => {
                this.setState({ isSecureEntry: !this.state.isSecureEntry });
              }}
            >
              <Image
                style={{ width: 24, height: 20 }}
                source={this.state.isSecureEntry ? iconEyeOpenMobileReskin : iconEyeCLoseMobileReskin}
              />
            </TouchableOpacity>
          )}
        </View>
        {errorMessageText}
      </View>
    );
  }
}
