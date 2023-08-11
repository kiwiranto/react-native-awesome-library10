import { Platform } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import RNInsider from 'react-native-insider';

import { NavigateTo } from '../../../Navigator/Navigator';

/**
 * 
 * @param {Function} setDataNotificationDispatch
 * @param {Object} props 
 */
export const libCheckNotifPermission = async ({ setDataNotificationDispatch, accessTokenData }, props) => {
   // const enabled = await messaging().hasPermission();

   // if (enabled) {
   //    messaging().setBackgroundMessageHandler(async notificationOpen => {
   //       if (notificationOpen.data.additionalInformation) {
   //          notificationOpen.data.additionalInformation = JSON.parse(notificationOpen.data.additionalInformation);
   //       }

   //       console.log('====NOTIFICATION BACKGROUND====', notificationOpen.data);

   //       if (notificationOpen.data.source == 'Insider' && accessTokenData.accessToken && Platform.OS == 'android') {
   //          RNInsider.handleNotification(notificationOpen);
   //       }
   //    });

   //    messaging().getInitialNotification()
   //       .then(notificationOpen => {
   //          if (notificationOpen) {

   //             if (notificationOpen.data.additionalInformation) {
   //                notificationOpen.data.additionalInformation = JSON.parse(notificationOpen.data.additionalInformation);
   //             }

   //             console.log('====NOTIFICATION ON APP CLOSE====', notificationOpen.data);

   //             setDataNotificationDispatch(notificationOpen.data);

   //             if (accessTokenData.accessToken) {
   //                NavigateTo(
   //                   'NotificationDetailScreen',
   //                   { notification: { item: notificationOpen.data } },
   //                   props
   //                );
   //             } else {
   //                NavigateTo('Login', false, props);
   //             }

   //          }
   //       });

   //    messaging().onNotificationOpenedApp(async (notificationOpen) => {
   //       if (notificationOpen.data.additionalInformation) {
   //          notificationOpen.data.additionalInformation = JSON.parse(notificationOpen.data.additionalInformation);
   //       }

   //       console.log('open push notification', notificationOpen);
   //       setDataNotificationDispatch(notificationOpen.data);

   //       if (accessTokenData.accessToken) {
   //          NavigateTo(
   //             'NotificationDetailScreen',
   //             { notification: { item: notificationOpen.data } },
   //             props
   //          );
   //       } else {
   //          NavigateTo('Login', false, props);
   //       }
   //    });
   // } else {
   //    // User doesn't have permission
   //    try {
   //       await messaging().requestPermission();
   //    } catch (error) {
   //       console.log(error);
   //    }
   // }
};
