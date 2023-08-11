import React, { Component } from 'react';
import { View, TextInput, Animated, Text, TouchableOpacity, Image } from 'react-native';

import CColors from './CColors';

import { iconDropdownThin } from '../Assets/app/help';
import { iconEyeOpenMobile, iconEyeCLoseMobile } from '../Assets/app/text-field';

export default class CTextInput extends Component {
   state = {
      isFocused: false,
      isSecureEntry: false,
      needSecureEntry: false
   };

   constructor(props) {
      super(props);

      this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
   };

   componentDidMount() {
      if (this.props.secureTextEntry != undefined) {
         this.setState({ isFocused: false, isSecureEntry: this.props.secureTextEntry, needSecureEntry: true });
      }
   };

   componentDidUpdate() {
      Animated.timing(this._animatedIsFocused, {
         toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
         duration: 200,
      }).start();
   };

   handleFocus = () => {
      this.setState({ isFocused: true })
      if (this.props.onFocus) {
         this.props.onFocus();
      }
   };

   handleBlur = () => {
      this.setState({ isFocused: false });
      if (this.props.onBlur) {
         this.props.onBlur();
      }
   };

   render() {
      const {
         placeholder,
         styleInput,
         styleView,
         iconStyle,
         value,
         label,
         subtitle,
         errorMessage,
         isvalid,
         isApp,
         isDropdown,
         onPressArrow,
         onChangeText,
         onKeyPress,
         keyboardType,
         editable,
         nativeId,
         maxLength,
         multiline,
         onContentSizeChange,
         nativeIdEye,
         iconDropdown,
         ...props
      } = this.props;
      const fontDefault = styleInput.fontSize || 16;
      const labelStyle = {
         position: 'absolute',
         zIndex: -1,
         left: 0,
         fontFamily: 'Muli-Regular',
         marginRight: isApp ? 10 : 0,
         top: this._animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -20],
         }),
         fontSize: this._animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [fontDefault, 14],
         }),
         color: this._animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: ['#aaa', CColors.brownishGrey],
         }),
      };
      const errorMessageText = errorMessage ? <Text style={{ marginTop: isApp ? (subtitle ? -10 : -40) : 0, marginBottom: 20, fontFamily: 'Muli-Regular', fontSize: 13, color: props.isGreen ? '#04bf48' : '#e53131' }}>{errorMessage}</Text> : null
      const subtitleText = subtitle ? <Text style={{ fontFamily: 'Muli-Regular' }}>{subtitle}</Text> : null
      const gapBottomWeb = !isApp ? { bottom: 14 } : {};
      return (
         <View style={{ marginBottom: 4, paddingTop: 18, ...styleView }}>
            <View style={{ position: 'relative' }}>
               <Animated.Text style={labelStyle}>
                  {label}
               </Animated.Text>

               <TextInput
                  style={{
                     marginBottom: 18,
                     paddingRight: this.state.needSecureEntry ? 30 : null,
                     fontFamily: 'Muli-Regular',
                     fontSize: fontDefault,
                     color: '#000',
                     borderBottomWidth: 0.5,
                     borderBottomColor: props.isGreen ? '#04bf48' : (isvalid || isvalid === null) ? '#646464' : '#e53131',
                     ...styleInput
                  }}
                  value={value}
                  label={label}
                  secureTextEntry={this.state.isSecureEntry}
                  onChangeText={onChangeText}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  onKeyPress={onKeyPress}
                  blurOnSubmit={true}
                  keyboardType={keyboardType ? keyboardType : "default"}
                  editable={editable}
                  testID={nativeId}
                  accessibilityLabel={nativeId}
                  maxLength={maxLength}
                  multiline={multiline}
                  onContentSizeChange={onContentSizeChange}
                  placeholder={placeholder}
               />
               {
                  this.state.needSecureEntry &&
                  <TouchableOpacity
                     style={{
                        width: 24,
                        height: 20,
                        position: 'absolute',
                        right: 0,
                        bottom: '55%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...iconStyle
                     }}
                     onPress={() => {
                        this.setState({ isSecureEntry: !this.state.isSecureEntry });
                     }}
                     testID={nativeIdEye}
                     accessibilityLabel={nativeIdEye}
                  >
                     <Image
                        style={{ width: 24, height: 20 }}
                        source={
                           this.props.isMobile
                              ? this.state.isSecureEntry ? iconEyeOpenMobile : iconEyeCLoseMobile
                              : this.state.isSecureEntry ? iconEyeOpenMobile : iconEyeCLoseMobile
                        }
                     />
                  </TouchableOpacity>
               }

               {
                  isDropdown &&
                  <TouchableOpacity
                     style={{
                        position: 'absolute',
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...gapBottomWeb,
                        ...iconStyle
                     }}
                     onPress={() => onPressArrow()}
                  >
                     <Image
                        style={{ width: 20, height: 16, marginHorizontal: 5 }}
                        source={iconDropdown !== '' ? iconDropdown : iconDropdownThin}
                     />
                  </TouchableOpacity>
               }
            </View>

            {errorMessageText ? errorMessageText : subtitleText}
         </View>
      );
   }
}
