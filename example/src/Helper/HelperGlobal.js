import { Dimensions, PixelRatio, Platform } from 'react-native';

export const emailLink = 'cs@myorbit.com';
export const appStoreLink = 'https://apps.apple.com/id/app/myorbit/id1534279868';
export const playStoreLink = 'https://play.google.com/store/apps/details?id=com.myorbit';
export const facebookLink = 'https://www.facebook.com/myorbitid';
export const twitterLink = 'https://www.twitter.com/myorbitid';
export const instagramLink = 'https://www.instagram.com/myorbitid';
export const whatsAppLink = `https://wa.me/628111776706?text=${encodeURIComponent('Hai Orbit :)')}`;
export const whatsAppPortalPengorbitLink = 'https://chat.whatsapp.com/DitCD7F18BT9Rl1u3t3sdo';
export const facebookDisplay = '/myorbitid';
export const twitterDisplay = '@myorbitid';
export const instagramDisplay = '@myorbitid';
export const whatsAppNumberDisplay = '+62 811-1776-706';
export const monthsId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const tokopediaVoucherLink = 'http://tsel.me/orbittokopedia';
export const tokopediaLink = 'https://tokopedia.link/QyvM590Cixb';
export const shopeeLink = 'https://shopee.co.id/telkomsel.official';
export const jdidLink = 'http://tsel.me/OrbitJDid';
export const blibliLink = 'https://www.blibli.com/merchant/telkomsel-official-store/TEO-70074';
export const tikTokLink = 'https://www.tiktok.com/@telkomsel?_t=8b0ze3a42Rl&_r=1';
export const lazadaLink = 'https://s.lazada.co.id/s.jJc2E';
export const bukalapakLink = 'https://www.bukalapak.com/telkomsel-official-store-official';
export const akulakuLink = 'https://s.akulaku.com/WFYQY4';
export const klikindomaretLink = 'https://www.klikindomaret.com/product/telkomsel-modem-orbit-star-z1';
export const grapariLink = 'https://www.telkomsel.com/contact-us/my-grapari';
export const topupPulsaLink = 'https://www.telkomsel.com/shops/digital-product/credit?utm_source=wec&utm_medium=quickbutton&utm_campaign=isipulsa&utm_id=wec-isipulsa&msisdn=';

export const dpi = (size) => {
   return size * 2;
};

export function DinamicSize(size) {
   const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
   const scale = SCREEN_WIDTH / 320;

   const newSize = size * scale;
   if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 3;
   } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 5;
   }
};