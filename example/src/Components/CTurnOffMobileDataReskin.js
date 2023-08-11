// Core
import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-navigation';

// Assets
import { iconWarning } from '../Assets/app/shared';
import { gifAnimationResetModem } from '../Assets/app/cpopup-reset-modem';

// Helper
import { dpi } from '../Helper/HelperGlobal';

// Components
import CButtonApp from './CButtonApp';
import CTextApp from './CTextApp';
import { Colors } from './app/CThemes';

const CTurnOffMobileData = ({ onPress }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Image
            source={iconWarning}
            style={styles.iconWarning}
          />

          <CTextApp style={styles.title}>
            {t('TurnOffMobileData.Title')}
          </CTextApp>

          <CTextApp style={styles.description}>
            {t('TurnOffMobileData.SubTitle')}
          </CTextApp>

          <Image
            source={gifAnimationResetModem}
            style={styles.iconPhoneReskin}
          />
        </View>

        <CButtonApp
          label={t('TurnOffMobileData.Button')}
          onPress={() => onPress()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  scrollView: {
    paddingHorizontal: dpi(8),
    paddingBottom: dpi(8)
  },
  contentContainer: {
    backgroundColor: Colors.white,
    alignItems: 'center'
  },
  iconWarning: {
    width: dpi(60),
    height: dpi(60),
    marginTop: dpi(12),
    marginBottom: dpi(16)
  },
  title: {
    fontFamily: 'TelkomselBatikSans-Bold',
    fontSize: dpi(12),
    textAlign: 'center',
    lineHeight: dpi(16),
    marginBottom: dpi(8)
  },
  description: {
    fontSize: dpi(7),
    textAlign: 'center',
    lineHeight: dpi(11),
    marginBottom: dpi(12)
  },
  iconPhoneReskin: {
    width: dpi(140),
    height: dpi(140),
    marginBottom: dpi(16),
    resizeMode: 'contain'
  }
});

export default CTurnOffMobileData;
