// Core
import * as React from 'react';
import { Modal, View, Image } from 'react-native';

// Components
import CColors from './CColors';
import CTextApp from './CTextApp';
import CButtonApp from './CButtonApp';

import { iconWarning } from '../Assets/app/shared';

/**
 * Orbit modal component.
 * @example
 * <CModalApp visible={true} />
 * <CModalApp visible={false} />
 * @param {boolean} visible - show modal.
 */
const CModalApp = ({
  visible = false,
  icon = iconWarning,
  title = 'Modal Title',
  description = 'Modal Description',
  buttonLabel = 'Button',
  onPress = () => { },
  customDescription = false
}) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
  >
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 26, 65, 0.7)',
        position: 'absolute'
      }}
    >
      <View style={{
        width: '90%',
        padding: 24,
        backgroundColor: CColors.white,
        borderRadius: 12,
        alignItems: 'center'
      }}>
        <Image source={icon} style={{ width: 128, height: 128 }} />
        <CTextApp top={24} size={20} lineHeight={27} center bold>{title}</CTextApp>
        {
          customDescription || <CTextApp bottom={16} size={14} lineHeight={22} center>{description}</CTextApp>
        }
        <CButtonApp top={16} label={buttonLabel} onPress={() => onPress()} />
      </View>
    </View>
  </Modal>
);

export default CModalApp;
