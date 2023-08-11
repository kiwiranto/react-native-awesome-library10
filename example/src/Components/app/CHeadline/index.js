import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { iconArrowSideLeftReskin } from '../../../Assets/app/shared';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CText from '../CText';
import { dpi } from '../../../Helper/HelperGlobal';

export default class CHeadline extends React.Component {
  state = {}

  render() {
    const { title, onPressBack, showArrow, styleTitle, nativeID } = this.props;

    return (
      <View style={styles.header}>
        {!showArrow &&
          <TouchableOpacity onPress={() => onPressBack ? onPressBack() : null } nativeID={nativeID}>
            <Image
              source={iconArrowSideLeftReskin}
              style={styles.arrowIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        }

        <View style={styles.textWrapper}>
          <CText bold inline style={{ ...styles.title, ...styleTitle }}>
            {title}
          </CText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: dpi(25),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dpi(10),
    backgroundColor: '#fff'
  },
  arrowIcon: {
    width: 24,
    height: 24
  },
  textWrapper: {
    alignItems: 'center',
    flex: 1
  },
  title: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#001A41',
    marginLeft: dpi(-12)
  }
});
