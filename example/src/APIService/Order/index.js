import { Platform } from 'react-native';

import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlShipment, baseUrlShipmentApiKey } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { sentryCapture } from '../../Helper/SentryLib';

export const redeemReferralCode = async (referralCode, productId, packagePrice) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'platform': Platform.OS,
            'x-api-Key': baseUrlShipmentApiKey
         }
      };
      const body = {
         'promoCode': referralCode,
         'productId': productId,
         'grandTotal': packagePrice,
         'qty': 1
      };
      const url = `${baseUrlShipment}v1/orders/referral_code`;

      return await AxiosAdapter.post(url, body, config);
   } catch (error) {
      sentryCapture(`APIService.Order@redeemReferralCode ${JSON.stringify(error)}`, '');

      return false;
   }
};