import { AxiosAdapter } from '../../Config/AxiosAdapter';
import { baseUrlContentMs, baseUrlContentApiKey } from '../../Config/MainConfig';
import { sentryCapture } from '../../Helper/SentryLib';

export const getPromoListData = async (limit, taggingId) => {
   try {
      const config = {
         headers: {
            'channel': 'mobile',
            'x-api-key': baseUrlContentApiKey
         },
         params: {
            order_by: 'desc',
            page: 0,
            per_page: limit,
            sort_by: 'Terbaru'
         }
      };

      if (taggingId) {
         config.params['promo_tagging'] = taggingId;
      }

      const url = `${baseUrlContentMs}v3/promo`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Promo@getPromoListData ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getPromoTaggingListData = async () => {
   try {
      const config = {
         headers: {
            'channel': 'mobile',
            'x-api-key': baseUrlContentApiKey
         }
      };

      const url = `${baseUrlContentMs}v3/promo-taggings`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      sentryCapture(`APIService.Promo@getPromoTaggingListData ${JSON.stringify(error)}`, '');

      return false;
   }
};

export const getPromoPopUpData = async () => {
   try {
      const config = {
         headers: {
            'channel': 'mobile',
            'x-api-key': baseUrlContentApiKey
         },
         params: {
            per_page: 1,
            promo_popup: 'yes'
         }
      };

      const url = `${baseUrlContentMs}v3/promo`;

      return await AxiosAdapter.get(url, config);
   } catch (error) {
      return false;
   }
};