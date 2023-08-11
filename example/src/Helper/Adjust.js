import { Adjust, AdjustConfig, AdjustEvent } from 'react-native-adjust';
import { adjustFCMToken } from '../Config/MainConfig';

export const adjustInit = async () => {
   try {
      const adjustConfig = new AdjustConfig('12y8poypv70g', AdjustConfig.EnvironmentSandbox);
      adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
      Adjust.create(adjustConfig);
      Adjust.setPushToken(adjustFCMToken);
      permissionAdjust();
   } catch (error) {
      console.log('adjustInit', error.message);
   }
};

/**
 * 
 * @param { String } token
 * @param { Array } param 
 * @param { Boolean } revenue 
 * @param { Number } harga 
 */
export const adjustTracker = (token, param, revenue = false, harga) => {
   try {
      permissionAdjust();
      const adjustEvent = new AdjustEvent(token);
      if (revenue && harga) {
         adjustEvent.setRevenue(harga, 'IDR');
      }
      if (param) {
         param.forEach((item) => {
            adjustEvent.addCallbackParameter(item.key, item.value);
         });
      }
      Adjust.trackEvent(adjustEvent);
   } catch (error) {
      console.log('adjustTracker', error.message);
   }
};

const permissionAdjust = () => {
   Adjust.requestTrackingAuthorizationWithCompletionHandler(function (status) {
      switch (status) {
         case 0:
            // ATTrackingManagerAuthorizationStatusNotDetermined case
            break;
         case 1:
            // ATTrackingManagerAuthorizationStatusRestricted case
            break;
         case 2:
            permissionAdjust();
            // ATTrackingManagerAuthorizationStatusDenied case
            break;
         case 3:
            // ATTrackingManagerAuthorizationStatusAuthorized case
            break;
      }
   });
};