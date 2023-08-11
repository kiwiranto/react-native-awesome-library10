import { Linking } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import NativeLinking from 'react-native/Libraries/Linking/NativeLinking';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import { LOGOUT, SET_DEEPLINK_DATA } from '../Config/Reducer';
import { store } from '../Config/Store';
import { isEmpty } from '../Helper/Function';
import { navigate } from '../Navigator/Navigator.mobile';

export const deeplinkApp = (url) => {
   if (url) {
      const { invoiceData, memberData } = store.getState();

      const route = url?.replace(/.*?:\/\//g, '');
      const routeSplit = route?.split('/');

      const ctaName = routeSplit?.[1];
      const ctaParams1 = routeSplit?.[2] ?? null;
      const ctaParams2 = routeSplit?.[3] ?? null;
      const ctaParams = ctaParams2 ?? ctaParams1;
      const dataParams = isEmpty(ctaParams) ? null : ctaParams.split('?').shift();
      const invoiceNumber = ctaParams2 ? ctaParams1 : invoiceData?.attributes?.invoiceNumber;

      let paramsNavigation = {};
      let routeName = '';
      let deeplinkData = {
         deeplinkURL: url,
         routeName: 'Dashboard',
         ctaName: ctaName,
         ctaData: null
      };

      const deeplinkListData = [
         { screen: 'dashboard', route: 'Dashboard', paramsNavigation: dataParams },
         { screen: 'depleted-quota', route: 'Dashboard', paramsNavigation: { scrollToBottom: true } },
         { screen: 'detail-data-package', route: 'PackageDetailQuotaScreen', paramsNavigation: { id: dataParams } },
         { screen: 'detail-help', route: 'HelpQuestionDetailScreen', paramsNavigation: { id: dataParams } },
         { screen: 'detail-promo', route: 'PromoDetailScreen', paramsNavigation: { id: dataParams } },
         { screen: 'detail-tsel-point', route: 'TelkomselPoinRewardScreen', paramsNavigation: dataParams },
         { screen: 'list-data-package', route: 'Store', paramsNavigation: dataParams },
         { screen: 'list-data-package-category', route: 'Store', paramsNavigation: { category: dataParams } },
         { screen: 'list-help', route: 'HelpScreen', paramsNavigation: dataParams },
         { screen: 'list-help-category', route: 'HelpCategoryDetailScreen', paramsNavigation: ctaParams2 ? { categoryName: ctaParams1, questionId: dataParams } : { categoryName: dataParams } },
         { screen: 'list-promo', route: 'ListPromoScreen', paramsNavigation: dataParams },
         { screen: 'list-tsel-point', route: 'TelkomselPoinScreen', paramsNavigation: dataParams },
         { screen: 'payment-expired', route: 'Dashboard', paramsNavigation: { scrollToBottom: true } },
         { screen: 'payment-failed', route: 'Dashboard', paramsNavigation: { scrollToBottom: true } },
         { screen: 'payment-pending', route: 'VerificationPaymentScreen', paramsNavigation: { invoiceNumber: dataParams } },
         { screen: 'payment-success', route: 'Dashboard', paramsNavigation: dataParams },
         { screen: 'set-home-location', route: 'HomebaseTransitionScreen', paramsNavigation: dataParams },
         { screen: 'success-login', route: 'LoginSocialMedia', paramsNavigation: { redirectCode: decodeURIComponent(ctaParams1), redirectState: decodeURIComponent(dataParams) } },
         { screen: 'xendit-verification-payment-app', route: 'VerificationPaymentScreen', paramsNavigation: invoiceNumber }
      ];

      deeplinkListData.forEach((item) => {
         if (ctaName.includes(item.screen)) {
            paramsNavigation = item.paramsNavigation;
            routeName = item.route;
            deeplinkData = {
               ...deeplinkData,
               routeName: item.route,
               ctaName: ctaName,
               ctaData: paramsNavigation
            };
         }
      });

      if (memberData) {
         store.dispatch({ type: SET_DEEPLINK_DATA, deeplinkData });
         if (ctaName == 'success-login') {
            navigate(routeName, deeplinkData);
         } else {
            setTimeout(() => {
               navigate(routeName, paramsNavigation);
            }, 500);
         }
      } else {
         if (ctaName == 'success-login') {
            store.dispatch({ type: SET_DEEPLINK_DATA, deeplinkData });
            navigate(routeName, { isLogin: true, deeplinkData });
         } else {
            CookieManager.clearAll();
            store.dispatch({ type: LOGOUT });
            navigate('Login');
         }
      }
   } else {
      store.dispatch({ type: SET_DEEPLINK_DATA, deeplinkData: {} });
   }
};

export const handlerBackgroundDeeplink = () => {
   Linking.addEventListener('url', (event) => {
      deeplinkApp(event?.url);
   });
   dynamicLinks().onLink((link) => {
      deeplinkApp(link.url);
   });
};

export const handlerKillAppDeeplink = async () => {
   const link = await dynamicLinks().getInitialLink(link => link);
   if (isEmpty(link)) {
      NativeLinking.getInitialURL().then(url => {
         setTimeout(() => {
            deeplinkApp(url);
         }, 500);
      });
   } else {
      setTimeout(() => {
         deeplinkApp(link.url);
      }, 500);
   }
};
