
export const getCTAButtonTitle = (activeItem, t, stockStatus = false) => {
   const status = stockStatus || getPreorderStatus(activeItem);

   switch (status) {
      case 'pre-order':
         return t('PackageScreen.PreOrderButtonTitle');
      case 'out-of-stock':
         return t('PackageScreen.OutOfStockButtonTitle');
      case 'normal':
         return t('PackageScreen.BuyButtonTitle');
   }
};

export const getCTAMessage = (activeItem, t) => {
   const status = getPreorderStatus(activeItem);

   switch (status) {
      case 'pre-order':
         return activeItem.preOrderBatch.deliveryText;
      case 'out-of-stock':
         return t('PackageScreen.OutOfStockMessage');
      case 'normal':
         return false;
   }
};

export const getPreorderStatus = (activeItem) => {
   if (activeItem?.preOrderUltimate) {
      if (activeItem?.preOrderBatch) {
         return 'pre-order';
      } else {
         if (activeItem?.isOutOfStock) {
            // Out of stock
            return 'out-of-stock';
         } else {
            // Normal
            return 'normal';
         }
      }
   }

   if (activeItem?.isOutOfStock && !activeItem?.preOrder) {
      return 'out-of-stock';
   }

   if (activeItem?.isOutOfStock && activeItem?.preOrder) {
      if (activeItem?.preOrderBatch) {
         // Pre order
         return 'pre-order'
      } else {
         // Out of stock
         return 'out-of-stock';
      }
   }

   if (!activeItem?.isOutOfStock && !activeItem?.preOrder) {
      // Normal
      return 'normal';
   }

   if (!activeItem?.isOutOfStock && activeItem?.preOrder) {
      // Normal
      return 'normal';
   }
};