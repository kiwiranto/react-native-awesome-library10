import React, { Component } from 'react';
import { View, TextInput, Animated, Text, TouchableOpacity, Image, Platform } from 'react-native';

import CColors from './CColors';

import { iconDropdownThin } from '../Assets/app/help';
import { iconEyeOpenMobileReskin, iconEyeCLoseMobileReskin } from '../Assets/app/text-field';

export default class CTextInput extends Component {
   constructor(props) {
      super(props)

      this.state = {
         isFocused: false,
         isSecureEntry: false,
         needSecureEntry: false
      }

      this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
      this.focusInput = React.createRef();
   }


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
         nativeID,
         maxLength,
         multiline,
         onContentSizeChange,
         nativeId,
         ...props
      } = this.props;
      const fontDefault = styleInput.fontSize || 16;
      const labelStyle = {
         position: 'absolute',
         zIndex: -1,
         left: 0,
         fontFamily: 'Poppins-Regular',
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
            outputRange: ['#66707A', CColors.brownishGrey],
         }),
      };
      const errorMessageText = errorMessage ? <Text style={{ marginTop: isApp ? (subtitle ? -10 : -40) : 0, marginBottom: 20, fontFamily: 'Poppins-Regular', fontSize: 13, color: props.isGreen ? '#04bf48' : '#ed0226' }}>{errorMessage}</Text> : null
      const subtitleText = subtitle ? <Text style={{ fontFamily: 'Poppins-Regular' }}>{subtitle}</Text> : null
      const gapBottomWeb = !isApp ? { bottom: 14 } : {};
      return (
         <View style={{ marginBottom: 4, paddingTop: 18, ...styleView }}>
            <View style={{ position: 'relative' }}>
               <TouchableOpacity
                  onPress={() => {
                     this.focusInput.focus();
                  }}
               >
                  <Animated.Text style={labelStyle}>{label}</Animated.Text>
               </TouchableOpacity>

               <TextInput
                  style={{
                     marginBottom: 18,
                     marginTop: Platform.OS == 'ios' ? 20 : 0,
                     paddingRight: this.state.needSecureEntry ? 30 : null,
                     fontFamily: 'Poppins-Regular',
                     fontSize: fontDefault,
                     color: '#000',
                     borderBottomWidth: 1,
                     borderBottomColor: isvalid ? '#646464' : '#ed0226',
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
                  nativeID={nativeID}
                  maxLength={maxLength}
                  multiline={multiline}
                  onContentSizeChange={onContentSizeChange}
                  ref={(ref) => { this.focusInput = ref; }}
                  testID={nativeId}
                  accessibilityLabel={nativeId}
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
                  >
                     <Image
                        style={{ width: 24, height: 20 }}
                        source={
                           this.props.isMobile
                              ? this.state.isSecureEntry ? iconEyeOpenMobileReskin : iconEyeCLoseMobileReskin
                              : this.state.isSecureEntry ? iconEyeOpenMobileReskin : iconEyeCLoseMobileReskin
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
                        style={{ width: 16, height: 16, }}
                        source={iconDropdownThin}
                     />
                  </TouchableOpacity>
               }
            </View>

            {errorMessageText ? errorMessageText : subtitleText}
         </View>
      );
   }
}
