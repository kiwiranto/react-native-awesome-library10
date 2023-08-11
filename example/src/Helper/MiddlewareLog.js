/* global middlewareLog */

import Axios from 'axios';
import { LazyImportMainConfig, LazyRNPlatform } from './System';

const MiddlewareLog = async (resultFunc, type, responseTime = 0) => {
   try {
      if ((await LazyImportMainConfig()).enableLog != 'true') {
         return;
      }

      let status = false;
      let url = false;
      let method = false;

      try {
         if ('response' in resultFunc) {
            status = resultFunc.response.status;
            url = resultFunc.response.config.url;
            method = resultFunc.response.config.method;
         } else {
            status = resultFunc.status;
            url = resultFunc.config.url;
            method = resultFunc.config.method;
         }
      } catch (error) {
         status = resultFunc
      }

      status = status ? status : 999;

      if (!url) {
         return;
      }

      url = new URL(url);

      let splitUrl = url.pathname.split('/');
      let urlDummy = url.pathname;

      url = `${splitUrl[1]}/${splitUrl[2]}/${splitUrl[3]}`;

      type = typeCustomAttributes(type, resultFunc);

      if (type == 'global') {
         await postLogging(status, status == 200 ? `success ${method}:${urlDummy}` : `failed ${method}:${urlDummy}`, `${method}:${url}`, responseTime, 'myorbit');
      } else if (type.includes(':')) {
         const valueSeparator = type.split(':');
         await postLogging(
            status,
            status == 200 ? `success ${method}:${urlDummy}` : `failed ${method}:${urlDummy}`,
            valueSeparator[2] ? `${valueSeparator[1]}:${valueSeparator[2]}` : `${valueSeparator[1]}`,
            responseTime, valueSeparator[0]
         );
      } else {
         await postLogging(status, status == 200 ? `success ${method}:${urlDummy}` : `failed ${method}:${urlDummy}`, `${method}:${url}`, responseTime, 'myorbit');
      }

      return resultFunc;
   } catch (error) {
      console.log(error);
      console.log('MiddlewareLog@middlewareLog', error.message);
   }
};

const postLogging = async (statusResponse, message, eventType, responseTime, serviceExternalName) => {
   try {
      const platformName = (await LazyRNPlatform()).OS;
      const version = (await LazyImportMainConfig()).version;
      const config = {
         headers: {
            'channel': platformName,
            'Content-Type': 'application/json',
            'Referrer': 'www1.myorbit.id',
            'x-api-key': (await LazyImportMainConfig()).baseUrlLogApiKey
         },
         timeout: 2000
      };

      const body = {
         success: 1,
         service: platformName,
         service_external: serviceExternalName,
         status_code: statusResponse,
         response_time: responseTime,
         message: message,
         version: version,
         event_type: eventType
      };

      const url = (await LazyImportMainConfig()).baseUrlLogInflux;
      const result = await Axios.post(url, JSON.stringify(body), config);
      return result;
   } catch (error) {
      console.log('MiddlewareLog@postLogging', error.message);
      return false;
   }
};

const thirdRDpartyValue = ['finnet', 'elisa', 'midtrans'];

const softIdAlias = {
   ovo: 'finnet',
   gopay: 'finnet',
   akulaku: 'finnet'
};

const typeCustomAttributes = (type, result) => {
   try {
      const attributes = result.data.data.attributes;

      let _type = false;
      let _cat = false;

      if ('redirectUrl' in attributes && attributes.redirectUrl) {
         _type = thirdRDpartyValue.find((str) => {
            const validRedirect = result.data.data.attributes.redirectUrl.includes(str);

            if (validRedirect) {
               try {
                  _cat = `${result.data.data.attributes.payment.softId}:${result.data.data.attributes.status.toLowerCase()}`;
               } catch (error) { }
            }

            return validRedirect
         })
      } else if ('payment' in attributes && attributes.payment) {
         Object.keys(softIdAlias).map((val, key) => {
            const checkSoftID = result.data.data.attributes.payment.softId == val;
            _type = checkSoftID ? softIdAlias[val] : false;
            _cat = checkSoftID ? `${result.data.data.attributes.payment.softId}:${result.data.data.attributes.status.toLowerCase()}` : false;
         })
      }

      if (_type)
         type = `${_type}:${_cat ? _cat : 'get-va'}`;

      return type;
   } catch (error) {
      return type;
   }
};

class ThrowAxiosError extends Error {
   constructor(message = '', response, ...args) {
      super(message, ...args);
      this.message = message;
      this.response = response;
   };
};

export const ReThrowAxiosError = ThrowAxiosError;
export default MiddlewareLog;