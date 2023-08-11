import React, { Component } from 'react';
import {
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  Image
} from 'react-native';
import { iconEyeCLoseMobileReskin, iconEyeOpenMobileReskin } from '../../../Assets/app/text-field';
import { iconDropdownThin } from '../../../Assets/app/help';

import CText from '../CText';
import { Colors, Fonts } from '../CThemes';

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
    const {
      label,
      styleLabel,
      styleInput,
      animated,
      isvalid,
      errorMessage,
      nativeIDError,
      isDropdown,
      onPressArrow,
      iconStyle,
      description,
      nativeId,
      ...props
    } = this.props;
    const fontDefault = styleInput?.fontSize || 16;
    const labelStyle = animated ? {
      position: 'absolute',
      left: 0,
      zIndex: -1,
      fontFamily: Fonts.poppinsBold,
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
        outputRange: [Colors.tselDarkBlue, Colors.brownishGrey]
      })
    } : {
      fontFamily: Fonts.poppinsBold,
      color: Colors.tselDarkBlue,
      fontSize: 16,
      marginBottom: 4
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={{ position: 'relative' }}>
          <Animated.Text style={{ ...labelStyle, ...styleLabel }}>{label}</Animated.Text>
          {description &&
            <Animated.Text style={{ fontFamily: Fonts.poppins, fontSize: 12, color: Colors.tselGrey60, paddingBottom: 8, fontWeight: '400' }}>{description}</Animated.Text>
          }
          <TextInput
            {...props}
            style={{
              paddingTop: 0,
              paddingBottom: 4,
              paddingRight: this.state.needSecureEntry ? 30 : 0,
              marginBottom: 9,
              backgroundColor: Colors.tselCardBackground,
              fontFamily: Fonts.poppins,
              fontSize: fontDefault,
              color: Colors.tselDarkBlue,
              borderBottomWidth: 1,
              borderBottomColor: Colors.tselGrey40,
              ...styleInput
            }}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            secureTextEntry={this.state.isSecureEntry}
            blurOnSubmit
            testID={nativeId}
            accessibilityLabel={nativeId}
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
                right: 4,
                bottom: 15
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

          {isDropdown &&
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 6,
                bottom: 14,
                justifyContent: 'center',
                alignItems: 'center',
                ...iconStyle
              }}
              onPress={() => onPressArrow()}
            >
              <Image
                style={{ width: 16, height: 16 }}
                source={iconDropdownThin}
              />
            </TouchableOpacity>
          }
        </View>

        {/* errorMessage */}
        <CText
          style={{
            fontFamily: Fonts.poppins,
            fontSize: 16,
            color: Colors.tselRed
          }}
          nativeID={nativeIDError}
        >
          {errorMessage}
        </CText>
      </View>
    );
  }
}
