// Core
import * as React from 'react';
import { Modal, View } from 'react-native';

// Components
import CColors from './CColors';
import CTextApp from './CTextApp';
import CButtonApp from './CButtonApp';

/**
 * Orbit modal confirmation component.
 * @example
 * <CModalConfirmation />
 * <CModalConfirmation visible={false} />
 * <CModalConfirmation visible={true} title="test" description="test" />
 * @param {any} props
 * @param {boolean} visible - font size.
 * @param {string} title - font size.
 * @param {string} description - font size.
 * @param {string} labelAccept - font size.
 * @param {string} labelCancel - font size.
 * @param {function} onAccept - font size.
 * @param {function} onCancel - font size.
 */
const CModalConfirmation = ({
  visible = false,
  title = 'Modal Title',
  description = 'Modal Description',
  labelAccept = 'Accept',
  labelCancel = 'Cancel',
  onAccept = () => { },
  onCancel = () => { },
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
        borderRadius: 12
      }}>
        <CTextApp bottom={22} size={20} lineHeight={27} bold center>{title}</CTextApp>
        {
          customDescription || <CTextApp center={false} bottom={16} size={14} lineHeight={22}>{description}</CTextApp>
        }
        <CButtonApp bottom={16} label={labelAccept} onPress={() => onAccept()} />
        <CButtonApp fontColor={'#0050AE'}label={labelCancel} outline outlineColor="#0050AE" onPress={() => onCancel()} />
      </View>
    </View>
  </Modal>
);

export default CModalConfirmation;
