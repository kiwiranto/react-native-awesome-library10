// Core
import React from 'react';
import {
  View,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

// Assets
import { iconWifi } from '../../../Assets/app/modem-info';
import {
  bgPopupSuccess,
  iconKeyReskin,
  iconCopyTextRevamp,
  iconValidGreen
} from '../../../Assets/app/shared';

// Helper
import { Colors } from '../CThemes';

// Components
import CText from '../CText';
import CButton from '../CButton';
import CToast from '../../../Components/CToast';
import { useTranslation } from 'react-i18next';

/**
 * Orbit default button component.
 * @example
 * <CResult
 *  image={bgPopupSuccess}
 *  title={'Title'}
 *  subtitle={'Subtitle'}
 *  isLoading={true/false}
 *  onPressButton={() => {your function}}
 * />
 * @param {any} props
 * @param {string} label - button name.
 */
const CResult = ({
  cardWifiInfo = false,
  title = 'Title',
  subtitle = 'Subtitle',
  modemData = null,
  image = bgPopupSuccess,
  toast = false,
  toastTitle = '',
  isLoading = false,
  buttonLabel = 'Lanjutkan',
  onPressButton = () => { },
  onPressCopied = () => { },
  buttonDisabled = false,
  buttonTimer = false,
  timer = 0,
  timerBracket = false,
  onFinishTimer = () => { }
}) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      {toast && (
        <CToast
          label={toastTitle}
          iconModal={iconValidGreen}
        />
      )}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1, paddingHorizontal: 16 }}>
        <View style={styles.contentContainer}>
          <Image
            source={image}
            style={styles.image}
          />
          
          <View style={{ marginHorizontal: 25 }}>
            <CText bold fontTselBatik size={18} style={styles.title}>{title}</CText>
            <CText size={16} color={Colors.tselGrey100} style={styles.subtitle}>{subtitle}</CText>
          </View>

          {cardWifiInfo && (
            <View style={styles.contentCard}>
              <View style={styles.contentInfo}>
                <Image source={iconWifi} style={styles.iconContent} resizeMode="contain" />

                <View>
                  <CText size={12} color={Colors.tselGrey100} style={styles.titleInfo}>
                    {t('ActivationProgress.CardLabel.LabelName')}
                  </CText>
                  <CText bold fontTselBatik size={16} style={styles.contentText}>{modemData?.attributes?.ssid}</CText>
                </View>
              </View>

              <View style={{ ...styles.contentInfo, marginBottom: 0 }}>
                <Image source={iconKeyReskin} style={styles.iconContent} resizeMode="contain" />

                <View>
                  <CText size={12} color={Colors.tselGrey100} style={styles.titleInfo}>
                    {t('ActivationProgress.CardLabel.LabelPassword')}
                  </CText>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CText bold fontTselBatik size={16} style={styles.contentText}>{modemData?.attributes?.password}</CText>
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => onPressCopied()}>
                      <Image source={iconCopyTextRevamp} style={{ width: 16, height: 16 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        <CButton
          loading={isLoading}
          label={buttonLabel}
          disabled={buttonDisabled}
          showTimer={buttonTimer}
          style={{ marginBottom: 32 }}
          time={timer}
          timerBracket={timerBracket}
          onFinishTimer={() => onFinishTimer()}
          onPress={() => onPressButton()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};


export default CResult;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 32
  },
  contentCard: {
    width: '100%',
    backgroundColor: Colors.tselCardBackground,
    padding: 16,
    borderRadius: 16
  },
  contentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  contentText: {},
  titleInfo: {
    marginBottom: 2
  },
  subtitleInfo: {
    fontSize: 14,
    color: Colors.tselDarkBlue,
    lineHeight: 22
  },
  iconContent: {
    width: 24,
    height: 24,
    marginRight: 18
  },
  image: {
    width: 128,
    height: 128,
    marginBottom: 32,
    marginTop: 32
  },
  title: {
    marginBottom: 16,
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24
  }
});
