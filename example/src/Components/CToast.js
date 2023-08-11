import * as React from 'react';
import {
  Image,
  Platform,
  View
} from 'react-native';
import { iconInfoBlue, iconInfoRed } from '../Assets/app/shared';
import CColors from './CColors';
import CTextApp from './CTextApp';

const CToast = ({
  label = 'change the label props',
  iconModal = iconInfoBlue,
  red = false
}) => {
  if (red) iconModal = iconInfoRed;

  const containerStyle = {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 25 : 15,
    zIndex: 10,
    alignItems: 'center',
    width: '100%'
  };

  const toastStyle = {
    width: '92%',
    backgroundColor: red ? CColors.alephMalesNgasihNama : CColors.tselLightBlue,
    borderRadius: 4,
    paddingHorizontal: 13.5,
    paddingVertical: 17.5,
    paddingRight: 25,
    flexDirection: 'row',
    alignItems: 'center'
  };

  return (
    <View style={containerStyle}>
      <View style={toastStyle}>
        <Image source={iconModal} style={{ width: 16, height: 16 }} />
        <CTextApp
          left={10}
          size={12}
          lineHeight={16}
          color={red ? CColors.tselDarkOrange : CColors.tselDarkBlue}
        >
          {label}
        </CTextApp>
      </View>
    </View>
  );
};

export default CToast;
