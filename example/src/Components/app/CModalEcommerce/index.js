// Core
import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';

// Assets
import {
  iconAkulaku,
  iconBlibli,
  iconBukalapak,
  iconGrapari,
  iconKlikIndomaret,
  iconLazada,
  iconShopee,
  iconTiktok,
  iconTokopedia
} from '../../../Assets/app/offline-purchase-transition';

// Components
import CText from '../CText';
import CModal from '../CModal';
import { iconCloseRound } from '../../../Assets/app/shared';
import {
  akulakuLink,
  blibliLink,
  bukalapakLink,
  grapariLink,
  klikindomaretLink,
  lazadaLink,
  shopeeLink,
  tikTokLink,
  tokopediaLink
} from '../../../Helper/HelperGlobal';
import { openUrlMobile } from '../../../Helper/MobileHelper';
import { isEmpty } from '../../../Helper/Function';

const CModalEcommerce = ({
  visible = false,
  officialStore = false,
  listEcommerce = !isEmpty(officialStore) ? officialStore
    :
    [
      {
        image: iconGrapari,
        label: 'GraPARI ',
        button_link: grapariLink
      },
      {
        image: iconShopee,
        label: 'Shopee',
        button_link: shopeeLink
      },
      {
        image: iconTokopedia,
        label: 'Tokopedia',
        button_link: tokopediaLink
      },
      {
        image: iconBlibli,
        label: 'Blibli',
        button_link: blibliLink
      },
      {
        image: iconTiktok,
        label: 'Tiktok',
        button_link: tikTokLink
      },
      {
        image: iconBukalapak,
        label: 'Bukalapak',
        button_link: bukalapakLink
      },
      {
        image: iconLazada,
        label: 'Lazada',
        button_link: lazadaLink
      },
      {
        image: iconAkulaku,
        label: 'Akulaku',
        button_link: akulakuLink
      },
      {
        image: iconKlikIndomaret,
        label: 'KlikIndomaret',
        button_link: klikindomaretLink
      }
    ],
  onClose = () => { }
}) => {
  const { t } = useTranslation();

  return (
    <CModal
      backdropPressToClose={true}
      visible={visible}
      positionBottom={true}
      styleInnerContainer={{
        paddingTop: 16,
        paddingBottom: 5,
        paddingHorizontal: 0
     }}
      onClose={onClose}
    >
      <View style={{ paddingTop: 72, flexGrow: 1, height: '90%' }}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 24, right: 24 }}
          onPress={() => onClose()}
        >
          <Image
            source={iconCloseRound}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ paddingHorizontal: 24 }}>
          <View>
            <CText bold fontTselBatik center size={32} bottom={8}>{t('DeliveryStatusScreen.PopupEcommerce.Title')}</CText>
            <CText size={16} center bottom={16}>{t('DeliveryStatusScreen.PopupEcommerce.Description1')}</CText>
            <CText size={14} center bottom={24}>{t('DeliveryStatusScreen.PopupEcommerce.Description2')}</CText>
          </View>

          <View>
            {listEcommerce?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.listEcommerce}
                  onPress={() => openUrlMobile(item?.button_link)}
                >
                  <Image
                    source={!isEmpty(officialStore) ? { uri: item?.image } : item?.image}
                    style={styles.iconEcommerce}
                  />
                  <CText bold fontTselBatik size={16}>{item?.label}</CText>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </CModal>
  );
};

export default CModalEcommerce;

const styles = StyleSheet.create({
  listEcommerce: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F3F3',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 16
  },
  iconEcommerce: {
    width: 40,
    height: 40,
    marginRight: 16
  }
});
