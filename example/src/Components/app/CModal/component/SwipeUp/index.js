import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { Colors } from '../../../../../Components/app/CThemes';

const SwipeUp = ({
   children,
   isSwipeLine = true,
   styleInnerContainer = {},
   visible = false,
   backdropPressToClose = false,
   onClose = () => { }
}) => {

   return (
      <Modal
         animationType={'fade'}
         transparent
         visible={visible}
      >
         <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPress={() => backdropPressToClose ? onClose() : null}
         >
            <View style={stylesProps().outterContainer}>
               <TouchableWithoutFeedback>
                  <View style={{ ...stylesProps().innerContainer, ...styleInnerContainer }}>
                  {
                     isSwipeLine && <View style={styles.modalSwipeLine} />
                  }
                  {
                     children
                  }  
                  </View>
               </TouchableWithoutFeedback>
            </View>
         </TouchableOpacity>
         

      </Modal>
   );
};

export default SwipeUp;

const styles = {
   modalSwipeLine: {
      width: 104,
      height: 2,
      marginTop: 12,
      marginBottom: 12,
      alignSelf: 'center',
      backgroundColor: Colors.tselGrey20
   }
};

export const stylesProps = () => StyleSheet.create({
   outterContainer: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: Colors.backgroundColorModal
   },
   innerContainer: {
      width: '100%',
      paddingTop: 48,
      paddingBottom: 32,
      paddingHorizontal: 24,
      backgroundColor: Colors.white,
      borderRadius: 24,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
   },
   buttonCloseContainer: {
      width: 40,
      height: 40,
      position: 'absolute',
      top: 20,
      right: 20
   },
   accept: {
      marginTop: 24
   }
});
