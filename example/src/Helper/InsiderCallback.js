import { Linking, Platform } from 'react-native';
import InsiderCallbackType from 'react-native-insider/src/InsiderCallbackType';
import RNInsider from 'react-native-insider';
import InAppReview from 'react-native-in-app-review';

import { AxiosAdapter } from '../Config/AxiosAdapter';
import { baseUrlInsiderMessageCenter, baseUrlInsiderMessageCenterApiKey } from '../Config/MainConfig';
import { SET_INSIDER_PUSH_NOTIF } from '../Config/Reducer';
import { store } from '../Config/Store';

const handleNavigationInsider = async (data) => {
   try {
      store.dispatch({ type: SET_INSIDER_PUSH_NOTIF, data });
      const memberData = store.getState()?.memberData;
      const dataPushNotif = data?.data;

      if (dataPushNotif?.titles && dataPushNotif?.description && dataPushNotif?.notification_category &&
         dataPushNotif?.button_type && dataPushNotif?.valid_until && dataPushNotif?.banner && dataPushNotif?.cta) {
         const dataInsider = {
            member_id: parseInt(memberData?.data?.data?.id),
            title: dataPushNotif?.titles,
            message: dataPushNotif?.description,
            notification_category: dataPushNotif?.notification_category,
            email: memberData?.data?.data?.attributes?.emailAccount,
            button_type: dataPushNotif?.button_type,
            valid_until: dataPushNotif?.valid_until,
            banner: dataPushNotif?.banner,
            cta: dataPushNotif?.cta,
            read_status: true
         };
         await createMessageCenterToInbox(dataInsider);
      }

      if (data?.data?.rating) {
         InAppReview.RequestInAppReview();
      }

      if (data?.source == 'Insider' || data?.data?.source == 'Insider' || data?.data?.screen) {
         const screen = data?.data?.screen;
         const id = data?.data?.id ? data?.data?.id : null;
         setTimeout(() => {
            Linking.openURL(`myorbit://cta/${screen}/${store.getState()?.memberData?.data?.data?.id}/${id}`);
         }, 1500);
      }
   } catch (error) {
      console.log('handleNavigationInsider', error.message);
   }
};

export const insiderCallBack = () => {
   RNInsider.init(
      'myorbitstaging',
      'group.com.myorbit.insider',
      async (type, data) => {
         switch (type) {
            case InsiderCallbackType.NOTIFICATION_OPEN:
               if(Platform.OS == 'ios'){
                  RNInsider.setForegroundPushCallback(async(foregroundData) => {
                     if(foregroundData?.aps){
                        return null;
                     }
                  });
                  if(data?.type == 0){
                     await handleNavigationInsider(data);
                  }
               }else{
                  await handleNavigationInsider(data);
               }
               break;
            case InsiderCallbackType.INAPP_BUTTON_CLICK:
               console.log('[INSIDER][INAPP_BUTTON_CLICK]: ', data);
               break;
            case InsiderCallbackType.TEMP_STORE_PURCHASE:
               console.log('[INSIDER][TEMP_STORE_PURCHASE]: ', data);
               break;
            case InsiderCallbackType.TEMP_STORE_ADDED_TO_CART:
               console.log('[INSIDER][TEMP_STORE_ADDED_TO_CART]: ', data);
               break;
            case InsiderCallbackType.TEMP_STORE_CUSTOM_ACTION:
               await handleNavigationInsider(data);
               break;
         }
      },
   );
   RNInsider.setActiveForegroundPushView();
   RNInsider.registerWithQuietPermission(false);
};

export const createMessageCenterToInbox = async (data) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-api-Key': baseUrlInsiderMessageCenterApiKey
         }
      };

      const url = `${baseUrlInsiderMessageCenter}v1/inbox`;

      return await AxiosAdapter.post(url, data, config);
   } catch (error) {
      return error.response;
   }
};
