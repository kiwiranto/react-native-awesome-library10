import React from 'react';
import {
   Image,
   StyleSheet,
   TouchableOpacity,
   View
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { SET_LANGUAGE } from '../../../Config/Reducer';

import { Colors, Fonts } from '../CThemes';
import CModal from '../CModal';
import CText from '../CText';

import {
   iconCheckGreen,
   iconLanguageEn,
   iconLanguageId
} from '../../../Assets/app/shared';

const CModalLanguage = ({
   languageListData = [
      {
         id: 'id',
         buttonId: 'btn-bahasa',
         icon: iconLanguageId,
         name: 'Bahasa Indonesia'
      },
      {
         id: 'en',
         buttonId: 'btn-english',
         icon: iconLanguageEn,
         name: 'English'
      }
   ],
   visible = true,
   onClose = () => { },
   onSelectLanguage = () => { }
}) => {
   const dispatch = useDispatch();
   const { language } = useSelector(state => state);
   const { t } = useTranslation();

   const _handleChangeLanguage = (lang) => {
      i18next.changeLanguage(lang, () => {
         dispatch({
            type: SET_LANGUAGE,
            language: lang
         });

         onSelectLanguage();
      });
   };

   return (
      <CModal
         backdropPressToClose={true}
         positionBottom={true}
         styleInnerContainer={{
            paddingTop: 24,
            paddingBottom: 24
         }}
         visible={visible}
         onPressClose={onClose}
      >
         <CText style={styles.headerTitle}>
            {t('DashboardScreen.ChooseLanguage')}
         </CText>

         {
            languageListData.map((data, index) => {
               return (
                  <TouchableOpacity
                     key={index}
                     accessibilityLabel={data.buttonId}
                     testID={data.buttonId}
                     style={styles.languageButton}
                     onPress={() => _handleChangeLanguage(data.id)}
                  >
                     <View style={styles.languageButtonTitleContainer}>
                        <Image
                           source={data.icon}
                           resizeMode={'contain'}
                           style={styles.languageButtonIcon}
                        />

                        <CText style={styles.languageButtonTitle} bold>
                           {data.name}
                        </CText>
                     </View>

                     {
                        language == data.id && (
                           <Image
                              source={iconCheckGreen}
                              resizeMode={'contain'}
                              style={styles.languageButtonIcon}
                           />
                        )
                     }
                  </TouchableOpacity>
               );
            })
         }
      </CModal>
   );
};

export default CModalLanguage;

const styles = StyleSheet.create({
   headerTitle: {
      marginBottom: 12,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderColor: Colors.tselGrey20,
      fontFamily: Fonts.telkomselBatikBold,
      fontSize: 16,
      lineHeight: 24,
      color: Colors.tselDarkBlue
   },

   languageButton: {
      paddingVertical: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: Colors.tselGrey20
   },
   languageButtonTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center'
   },
   languageButtonIcon: {
      width: 24,
      height: 24
   },
   languageButtonTitle: {
      marginLeft: 14,
      fontSize: 13,
      color: Colors.tselDarkBlue
   }
});