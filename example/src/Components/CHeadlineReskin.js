import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { iconLeftBlack } from '../Assets/app/package-detail-kuota';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CText from './CText';
import { dpi } from '../Helper/HelperGlobal';

export default class CHeadline extends React.Component {
  state = {}

  render() {
    const { title, onPressBack, showArrow, styleTitle } = this.props;

    return (
      <View style={styles.header}>
        {!showArrow &&
          <TouchableOpacity onPress={onPressBack}>
            <Image
              source={iconLeftBlack}
              style={styles.arrowIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        }

        <View style={styles.textWrapper}>
          <CText style={styles.title}>
            {title}
          </CText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: dpi(33),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dpi(10),
    backgroundColor: '#fff',
    paddingTop:dpi(6)
  },
  arrowIcon: {
    width: dpi(12),
    height: dpi(12)
  },
  textWrapper: {
    alignItems: 'center',
    flex: 1
  },
  title: {
    fontSize: dpi(8),
    color: '#001A41',
    marginLeft: dpi(-12),
    fontWeight:'700',
    fontFamily: 'TelkomselBatikSans-Regular'
  }
});
