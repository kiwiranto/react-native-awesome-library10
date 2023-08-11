import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlNotification, baseUrlNotificationApiKey } from '../../Config/MainConfig';
import { store } from '../../Config/Store';
import { sentryCapture } from '../../Helper/SentryLib';

export const getNotificationListData = async (memberId, limit) => {
   try {
      const { accessTokenData } = store.getState();
      const config = {
         headers: {
            'Authorization': `Bearer ${accessTokenData?.accessToken}`,
            'Content-Type': 'application/json',
            'x-api-key': baseUrlNotificationApiKey
         }
      };
      const body = {
         limit: limit,
         memberId: memberId,
         orderBy: 'desc',
         sortBy: 'created'
      };
      const url = `${baseUrlNotification}v2/notifications/inbox`;

      return await AxiosAdapter.post(url, body, config);
   } catch (error) {
      sentryCapture(`APIService.Notification@getNotificationListData ${JSON.stringify(error)}`, '');

      return false;
   }
};