import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Colors } from '../CThemes';

export default class CLoading extends React.Component {
  render() {
		/* Opacity val : 0 || 0.5 || 1 */
		const { opacity = '0.75', size = 50 } = this.props;
		const bgOpacity = `rgba(255,255,255, ${opacity})`;

    return (
      <View style={{...styles.loaderMask, backgroundColor: bgOpacity }}>
        <View style={{ ...styles.loaderContainer, width: size + 20, height: size + 20}}>
          <ActivityIndicator size={size} color={Colors.tselRed} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	loaderMask: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 9999,
		backgroundColor: 'rgba(255,255,255,0.75)'
	},
	loaderContainer: {
		width: 70,
		height: 70,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 35,
		backgroundColor: '#fff',
		elevation: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.15,
		shadowRadius: 5
	}
});