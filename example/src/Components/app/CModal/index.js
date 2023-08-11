import * as React from 'react';

import PopUp from './component/PopUp';
import SwipeUp from './component/SwipeUp';

/**
 * Orbit modal component.
 * @example
 * <CModal visible={true} />
 * <CModal visible={false} />
 * @param {boolean} visible - show modal.
 */

const CModal = ({
  backdropPressToClose = false,
  buttonClose = false,
  description = false,
  height = null,
  icon = false,
  labelAccept = false,
  labelCancel = false,
  limitHitNiknok = false,
  loading = false,
  nativeId = '',
  nativeIdSecond = '',
  nativeIdTitle = '',
  nativeIdDesc = '',
  styleIcon = {},
  positionBottom = false,
  styleDescription = {},
  styleInnerContainer = {},
  styleTitle = {},
  swipeUp = false,
  title = false,
  top = 0,
  visible = false,
  isSwipeLine = true,
  onClose = () => { },
  onPressAccept = () => { },
  onPressCancel = () => { },
  onPressClose = () => { },
  children
}) => {
  return (
    !swipeUp ? (
      <PopUp
        backdropPressToClose={backdropPressToClose}
        buttonClose={buttonClose}
        description={description}
        icon={icon}
        labelAccept={labelAccept}
        labelCancel={labelCancel}
        limitHitNiknok={limitHitNiknok}
        loading={loading}
        nativeId={nativeId}
        nativeIdSecond={nativeIdSecond}
        nativeIdTitle={nativeIdTitle}
        nativeIdDesc={nativeIdDesc}
        positionBottom={positionBottom}
        styleDescription={styleDescription}
        styleIcon={styleIcon}
        styleInnerContainer={styleInnerContainer}
        styleTitle={styleTitle}
        title={title}
        visible={visible}
        onPressAccept={onPressAccept}
        onPressCancel={onPressCancel}
        onPressClose={onPressClose}
        children={children}
      />
    ) : (
      <SwipeUp
        children={children}
        height={height}
        isSwipeLine={isSwipeLine}
        backdropPressToClose={backdropPressToClose}
        positionBottom={positionBottom}
        styleInnerContainer={styleInnerContainer}
        top={top}
        visible={visible}
        onClose={onClose}
      />
    )
  );
};

export default CModal;