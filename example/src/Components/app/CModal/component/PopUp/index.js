import * as React from 'react';
import { Image, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import CButton from '../../../CButton';
import CText from '../../../CText';

import { styles, stylesProps } from '../../style';

import { iconCloseRound } from '../../../../../Assets/app/shared';

/**
 * Orbit modal component.
 * @example
 * <CModal visible={true} />
 * <CModal visible={false} />
 * @param {boolean} visible - show modal.
 */
function PopUp({
   buttonClose,
   description,
   icon,
   labelAccept,
   labelCancel,
   loading,
   onPressAccept,
   onPressCancel,
   onPressClose,
   positionBottom,
   limitHitNiknok,
   styleInnerContainer,
   styleTitle,
   styleDescription,
   styleIcon,
   title,
   visible,
   nativeId,
   nativeIdSecond,
   nativeIdTitle,
   nativeIdDesc,
   backdropPressToClose,
   children
}) {
   const { t } = useTranslation();

   return (
      <Modal
         animationType={'fade'}
         transparent
         visible={visible}
      >
         <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPress={() => backdropPressToClose ? onPressClose() : null}
         >
            <View style={stylesProps(positionBottom).outterContainer}>
               <TouchableWithoutFeedback>
                  <View style={{ ...stylesProps(positionBottom).innerContainer, ...styleInnerContainer }}>
                     {
                        buttonClose && onPressClose ? (
                           <TouchableOpacity
                              style={stylesProps(positionBottom).buttonCloseContainer}
                              onPress={onPressClose}>
                              <Image
                                 style={styles.buttonCloseIcon}
                                 source={iconCloseRound}
                              />
                           </TouchableOpacity>
                        ) : null
                     }

                     {icon ? (
                        <Image
                           source={icon}
                           style={[styles.icon, styleIcon]}
                        />
                     ) : null}

                     {
                        title ? (
                           <CText
                              children={title}
                              style={{ ...styles.title, ...styleTitle }}
                              nativeId={nativeIdTitle}
                           />
                        ) : null
                     }

                     {
                        description ? (
                           <CText
                              children={description}
                              style={{ ...styles.description, ...styleDescription }}
                              nativeId={nativeIdDesc}
                           />
                        ) : null
                     }

                     {
                        children ? (
                           <View>
                              {children}
                           </View>
                        ) : null
                     }

                     {labelAccept && onPressAccept ? (
                        <CButton
                           nativeId={nativeId}
                           label={labelAccept}
                           loading={loading}
                           onPress={onPressAccept}
                           style={stylesProps(positionBottom).accept}
                        />
                     ) : null}

                     {
                        labelCancel && onPressCancel ? (
                           <CButton
                              nativeId={nativeIdSecond}
                              label={labelCancel}
                              onPress={onPressCancel}
                              outline
                              style={styles.cancel}
                              disabled={loading}
                           />
                        ) : null
                     }

                     {
                        (limitHitNiknok || limitHitNiknok === 0) && (
                           <CText center style={{ paddingTop: 16, alignSelf: 'center' }}>
                              {t('CModal.limit')} :{' '}

                              <CText color="#ED0226">
                                 {limitHitNiknok} {t('CModal.time')}
                              </CText>
                           </CText>
                        )
                     }
                  </View>
               </TouchableWithoutFeedback>
            </View>
         </TouchableOpacity>
      </Modal>
   );
};

PopUp.defaultProps = {
   buttonClose: false,
   description: false,
   icon: false,
   labelAccept: false,
   labelCancel: false,
   loading: false,
   onPressAccept: false,
   onPressCancel: false,
   onPressClose: false,
   positionBottom: false,
   limitHitNiknok: false,
   title: false,
   visible: false,
   nativeId: ''
};

export default PopUp;
