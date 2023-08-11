// Core
import * as React from 'react';
import { View, Image } from 'react-native';

// Components
import CTextApp from './CTextApp';
import CButtonApp from './CButtonApp';
import CFlexRow from './CFlexRow';
// Assets
import { bgEmptyStateOne } from '../Assets/app/shared';
// Helper
import { store } from '../Config/Store';

/**
 * Orbit modal component.
 * @example
 * <CFullscreenPopup visible={true} />
 * <CFullscreenPopup visible={false} />
 * @param {boolean} visible - show modal.
 */
const CFullscreenPopup = ({
  visible = true,
  icon = bgEmptyStateOne,
  title = 'Modal Title',
  description = 'Modal Description',
  disclaimer = false,
  buttonLabel,
  onPress = () => { },
  children
}) => {
  const { modemType } = store.getState();

  return visible ? (
    <View
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <View style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32
      }}>
        <Image source={icon} style={{ width: 128, height: 128 }} />
        <CTextApp top={32} size={20} lineHeight={27} center bold>{title}</CTextApp>
        {modemType == 'NOTION' && <CTextApp top={16} size={14} lineHeight={22} center>{disclaimer}</CTextApp>}
        <CTextApp top={16} size={14} lineHeight={22} center>{description}</CTextApp>
        {children}
      </View>

      {
        buttonLabel && (
          <CFlexRow padding={16}>
            <CButtonApp top={16} label={buttonLabel} onPress={() => onPress()} />
          </CFlexRow>
        )
      }
    </View>
  ) : null;
};

export default CFullscreenPopup;