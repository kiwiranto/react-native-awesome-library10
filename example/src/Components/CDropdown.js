import React, { Component } from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { dpi } from '../Helper/HelperGlobal';
import CColors from './CColors';
export default class CDropdown extends Component {

  _onPressSelect = (item) => {
    this.props.onSelectList(item);
  };

  render() {
    const { data, isOpen, onPress, nativeId } = this.props;

    if (isOpen) {
      return (
          <FlatList
            nestedScrollEnabled={true}
            style={{
              marginTop: dpi(-16),
              marginBottom: dpi(8),
              height: dpi(142),
              width: "100%",
              elevation: 5,
              backgroundColor: CColors.white,
              borderRadius: dpi(10)
            }}
            data={data}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                testID={nativeId}
                accessibilityLabel={nativeId}
                style={[
                  styles.btn,
                ]}
                key={item.key}
                onPress={() =>
                  this._onPressSelect(item)
                }
              >
                <Text style={[styles.btnText, { color: '#000' }]}>
                  {item.name.includes("::") ? item.name.split('::').join(' : ') : item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
      );
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    paddingTop: dpi(8),
    paddingBottom: dpi(8),
    backgroundColor: CColors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0"
  },
  btnText: {
    marginLeft: dpi(8),
    textAlign: "left",
    color: 'white',
    fontSize: 18,
  },
});
