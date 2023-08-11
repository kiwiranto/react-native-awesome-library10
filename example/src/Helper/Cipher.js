export const DecryptAES = (string, hash) => {
   try {
      const key = hash.substr(hash.length - 32);
      const iv = hash.substring(0, 16);

      const CryptoJS = require('crypto-js');
      const bytes = CryptoJS.AES.decrypt(
         { ciphertext: CryptoJS.enc.Base64.parse(string) },
         CryptoJS.enc.Utf8.parse(key),
         { iv: CryptoJS.enc.Utf8.parse(iv) }
      );

      return bytes.toString(CryptoJS.enc.Utf8);
   } catch (error) {
      return false;
   }
};

export const EncryptAES = (string, accessToken) => {
   try {
      const key = accessToken.substr(accessToken.length - 32);
      const iv = accessToken.substring(0, 16);

      const CryptoJS = require('crypto-js');
      const cipher = CryptoJS.AES.encrypt(string, CryptoJS.enc.Utf8.parse(key), {
         iv: CryptoJS.enc.Utf8.parse(iv),
         padding: CryptoJS.pad.Pkcs7,
         mode: CryptoJS.mode.CBC
      });

      return cipher.toString();
   } catch (error) {
      return false;
   }
};