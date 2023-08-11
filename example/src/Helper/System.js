/* global System */

export const LazyRNImport = async () => {
   try {
      const LazyRN = System.import(/* webpackChunkName: 'rn-web' */  'react-native');
      return await LazyRN;
   } catch (error) {
      return await require('react-native');
   }
};

export const LazyRNImportPackage = async (_package) => {
   const _LazyRNImport = await LazyRNImport();
   const LazyI = _LazyRNImport[_package];
   return await LazyI;
};

export const LazyRNPlatform = async () => (await LazyRNImportPackage('Platform'));

export const LazyImportMainConfig = async (_package) => {
   const _import = await LazyRNPlatform() == 'web' ?
      System.import(/* webpackChunkName: 'main-config-web' */ '../Config/MainConfig.web') :
      require('../Config/MainConfig')

   return await _import
};