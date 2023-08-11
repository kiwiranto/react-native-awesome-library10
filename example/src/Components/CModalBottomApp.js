// Core
import * as React from 'react';
import { Modal, View, Image, TouchableOpacity } from 'react-native';

// Components
import CColors from './CColors';
import CTextApp from './CTextApp';
import CButtonApp from './CButtonApp';

import { iconWarning, iconCloseRound } from '../Assets/app/shared';

/**
 * Orbit modal component.
 * @example
 * <CModalBottomApp visible={true} />
 * <CModalBottomApp visible={false} />
 * @param {boolean} visible - show modal.
 */
const CModalBottomApp = ({
  visible = false,
  icon = iconWarning,
  closeIcon = false,
  closeButton = () => { },
  title = 'Modal Title',
  description = 'Modal Description',
  labelAccept = '',
  labelCancel = '',
  onAccept = () => { },
  onCancel = () => { }
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
        position: 'relative'
      }}
    >
      <View style={{
        width: '100%',
        padding: 24,
        paddingTop: 82,
        backgroundColor: CColors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
      }}>
        {closeIcon ? (
          <TouchableOpacity style={{ alignSelf: 'flex-end', position: 'absolute', right: 20, top: 20 }} onPress={closeButton}>
            <Image resizeMode='contain' style={{ width: 40, height: 40 }} source={iconCloseRound} />
          </TouchableOpacity>
        ) : null}
        {
          icon ? <Image source={icon} style={{ width: 128, height: 128 }} /> : null
        }

        <CTextApp top={24} size={20} lineHeight={24} center style={{ fontFamily: 'TelkomselBatikSans-Bold' }}>{title}</CTextApp>
        <CTextApp top={12} size={14} lineHeight={22} center>{description}</CTextApp>
        <CButtonApp top={48} label={labelAccept} onPress={() => onAccept()} />
        {
          labelCancel ? <CButtonApp top={16} label={labelCancel} outline onPress={() => onCancel()} /> : null
        }
      </View>
    </View>
  </Modal>
);

export default CModalBottomApp;
