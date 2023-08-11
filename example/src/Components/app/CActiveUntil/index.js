// Core
import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { iconInformation, iconInformationDarkBlue } from '../../../Assets/app/side-drawer';
import { getFormattedDate } from '../../../Helper/MobileHelper';
import { Colors } from '../CThemes';

// Components
import CText from '../CText';

class CActiveUntil extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false,
      isDisabled: false
    };
  }

  _initDataContent = () => {
    const { t, simcardStatus } = this.props;

    let attrContent = {
      labelText: t('DashboardScreen.ExpiredSimcard.WidgetActiveUntil.Active.LabelText'),
      tooltipText: t('DashboardScreen.ExpiredSimcard.WidgetActiveUntil.Active.TooltipText'),
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: 0,
      top: 38
    };

    if (simcardStatus?.isExpired) {
      attrContent = {
        labelText: t('DashboardScreen.ExpiredSimcard.WidgetActiveUntil.Expired.LabelText'),
        tooltipText: t('DashboardScreen.ExpiredSimcard.WidgetActiveUntil.Expired.TooltipText'),
        backgroundColor: Colors.tselRed,
        paddingHorizontal: 12,
        paddingVertical: 4,
        top: 40
      };
    } else if (simcardStatus?.isGracePeriod) {
      attrContent = {
        labelText: t('DashboardScreen.ExpiredSimcard.WidgetActiveUntil.GracePeriod.LabelText'),
        tooltipText: t('DashboardScreen.ExpiredSimcard.WidgetActiveUntil.GracePeriod.TooltipText'),
        backgroundColor: Colors.tselMustard,
        paddingHorizontal: 12,
        paddingVertical: 4,
        top: 40
      };
    }

    return attrContent;
  };

  _setShowTooltip = () => {
    this.setState({
      showTooltip: true,
      isDisabled: true
    }, () => {
      setTimeout(() => {
        this.setState({
          showTooltip: false,
          isDisabled: false
        });
      }, 2000);
    });
  }

  render() {
    const { showTooltip, isDisabled } = this.state;
    const { simcardStatus, expiryDate, top, bottom, left, right, isBlack, isSpace } = this.props;
    const attrContent = this._initDataContent();
    const isSpaceBetween = (simcardStatus?.isExpired || simcardStatus?.isGracePeriod) ? false : isSpace ? true : false;

    const icon = (simcardStatus?.isExpired || simcardStatus?.isGracePeriod) ? iconInformation : isBlack ? iconInformationDarkBlue : iconInformation;
    const color = (simcardStatus?.isExpired || simcardStatus?.isGracePeriod) ? Colors.white : isBlack ? Colors.tselGrey100 : Colors.white;

    return (
      <View>
        <TouchableOpacity
          disabled={isDisabled}
          style={{
            position: 'relative',
            flexDirection: 'row',
            alignSelf: isSpaceBetween ? 'auto' : 'flex-start',
            alignItems: 'center',
            justifyContent: isSpaceBetween ? 'space-between' : 'flex-start',
            paddingHorizontal: attrContent.paddingHorizontal,
            paddingVertical: attrContent.paddingVertical,
            marginTop: top,
            marginRight: right,
            marginBottom: bottom,
            marginLeft: left,
            backgroundColor: attrContent.backgroundColor,
            borderRadius: 16
          }}
          onPress={() => {
            this._setShowTooltip();
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 4 }}>
            <Image source={icon} style={{ width: 12, height: 12, marginRight: 6 }} />
            <CText size={10} color={color} top={2}>
              {attrContent.labelText}
            </CText>
          </View>

          {!simcardStatus?.isExpired && (
            <CText size={10} color={color} top={2}>
              {getFormattedDate(expiryDate, 'll')}
            </CText>
          )}
        </TouchableOpacity>

        {showTooltip && (
          <View style={{ ...styles.backgroundTooltip, top: attrContent.top }}>
            <View style={styles.triangle} />
            <CText color={Colors.tselDarkBlue} size={10}>{attrContent.tooltipText}</CText>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {
    modemData
  } = state;
  return {
    modemData
  };
};

export default connect(mapStateToProps)(withTranslation()(CActiveUntil));

const styles = StyleSheet.create({
  backgroundTooltip: {
    width: 231,
    backgroundColor: Colors.tselCardBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    position: 'absolute',
    left: -5,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6
  },
  triangle: {
    position: 'absolute',
    top: -10,
    left: 8,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 15,
    borderBottomWidth: 17,
    borderLeftWidth: 15,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.tselCardBackground,
    borderLeftColor: 'transparent'
  }
});
