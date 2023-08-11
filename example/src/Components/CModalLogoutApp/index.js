import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation } from 'react-i18next';
import CText from '../CText';
import { dpi } from '../../Helper/HelperGlobal';

function CModalLogoutApp(props) {
  const {
    title,
    subtitle,
    firstButtonOnPress,
    secondButtonOnPress,
    firstButtonTitle,
    secondButtonTitle,
    visible
  } = props;

  return (
    <View>
      <Modal animationType="fade" transparent visible={visible}>
        <View style={styles.modalLogout}>
          <View style={styles.modalLogoutCard}>
            <CText style={styles.modalLogoutTitle}>
              {title}
            </CText>
            <CText style={styles.modalLogoutSubTitle}>
              {subtitle}
            </CText>
            <TouchableOpacity onPress={firstButtonOnPress} style={styles.modalLogoutOk}>
              <CText style={styles.modalLogoutOkTitle}>
                {firstButtonTitle}
              </CText>
            </TouchableOpacity>
            <TouchableOpacity onPress={secondButtonOnPress} style={styles.modalLogoutCancel}>
              <CText style={styles.modalLogoutCancelTitle}>
                {secondButtonTitle}
              </CText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default withTranslation()(CModalLogoutApp);

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    maxWidth: 350,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16
  },
  modalLogout: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalLogoutCard: {
    borderRadius: dpi(6),
    padding: dpi(12),
    backgroundColor: '#ffffff',
    // maxHeight: dpi(150),
    width: '90%'
  },
  modalLogoutTitle: {
    fontSize: dpi(10),
    fontFamily: 'Poppins-Bold',
    color: '#001A41',
    marginBottom: dpi(6)
  },
  modalLogoutSubTitle: {
    fontSize: dpi(7),
    fontFamily: 'Poppins-Regular',
    color: '#4E5764',
    marginBottom: dpi(8)
  },
  modalLogoutOk: {
    backgroundColor: '#ED0226',
    borderRadius: dpi(50),
    maxWidth: dpi(160),
    maxHeight: dpi(24),
    width: '100%',
    paddingVertical: dpi(6),
    alignItems: 'center',
    marginBottom: dpi(4)
  },
  modalLogoutOkTitle: {
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
    fontSize: dpi(6.5)
  },
  modalLogoutCancel: {
    borderColor: '#0050AE',
    borderWidth: 1,
    borderRadius: dpi(50),
    maxWidth: dpi(160),
    maxHeight: dpi(24),
    width: '100%',
    paddingVertical: dpi(6),
    alignItems: 'center'
  },
  modalLogoutCancelTitle: {
    color: '#0050AE',
    fontFamily: 'Poppins-Bold',
    fontSize: dpi(6.5)
  }
});
