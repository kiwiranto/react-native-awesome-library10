import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import OTPInputView from 'rn-otp-input';
import { Colors, Fonts } from '../CThemes';
import CText from '../CText';

class OTPComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            OTPCode: ''
        };
    }

    componentDidUpdate(prepvProps) {
        const { resetOTP } = this.props;

        if (resetOTP != prepvProps.resetOTP) {
            if (resetOTP == true) {
                this.setState({
                    OTPCode: ''
                });
            }
        }
    }

    _setOTPCode = (code) => {
        this.setState({ OTPCode: code }, () => {
            this.props.setOTP(code);
        });
    }

    render() {
        const { otpLength, size, errorOTP, errorMessage, resetError, containerStyle = {} } = this.props;

        return (
            <View style={{ marginHorizontal: 24 }}>
                <OTPInputView
                    nativeId='otpInput'
                    style={{ width: otpLength > 4 ? 280 : 240, height: 50, alignSelf: 'center', ...containerStyle }}
                    pinCount={otpLength ? otpLength : 4}
                    code={this.state.OTPCode}
                    codeInputFieldStyle={{
                        width: size ? size.width : otpLength > 4 ? 40 : 48,
                        height: size ? size.height : otpLength > 4 ? 45 : 54,
                        fontSize: 16,
                        fontFamily: Fonts.poppinsBold,
                        color: Colors.black,
                        backgroundColor: '#fff',
                        borderColor: Colors.tselDarkBlue,
                        borderWidth: 0,
                        borderBottomWidth: 2
                    }}
                    onCodeChanged={(code) => {
                        this.setState({ OTPCode: code });
                        this._setOTPCode(code);
                        resetError();
                    }}
                    autoFocusOnLoad={false}
                />

                {errorOTP && (
                    <CText style={styles.errorMessage}>{errorMessage}</CText>
                )}
            </View>
        );
    }
}

export default OTPComponent;

const styles = StyleSheet.create({
    errorMessage: {
        color: Colors.tselRed,
        fontSize: 16,
        marginTop: 20,
        marginHorizontal: 4,
        alignSelf: 'center'
    }
});
