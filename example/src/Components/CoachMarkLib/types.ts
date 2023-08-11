import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface CoachmarkProps {
  message?: string;
  title?: string;
  autoShow?: boolean;
  onHide?: () => void;
  onShow?: () => void;
  isAnchorReady?: boolean;
  renderArrow?: CoachmarkViewProps['renderArrow'];
  accessibilityLabel?: string;
  testID?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  leadingIcon?: any;
  buttonPrevText?: string;
  buttonNextText?: string;
  buttonSkipText?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  isHideSkipButton?: boolean;
  isShowPreviousButton?: boolean;
  arrowOffset?: number;
  arrowMiddle?: boolean;
  buttonSkipOffset?: number;
  buttonNextOffset?: number;
  buttonPreviousOffset?: number;
  buttonOnContent?: boolean;
  isVisible?: boolean;
  children?: React.ReactNode;
  top?: number;
  enableButtonContent?: boolean;
  step?: string;
  styleButtonOnContent?: string;
  styleButtonOnDone?: string;
  closeButton?: boolean;
  buttonOnDone?: boolean;
}

export enum CoachmarkPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface CoachmarkArrowProps {
  position?: CoachmarkPosition;
  x: number;
  arrowOffset?: number;
}

export interface CoachmarkContentProps {
  message: string;
  title?: string;
  leadingIcon?: any;
  buttonOnContent?: boolean;
  buttonOnDone?: boolean;
  handleHide?: any;
  buttonNextText?: string;
  buttonPrevText?: string;
  buttonSkipText?: string;
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  showButtonPrev?: boolean;
  step?: string;
  styleButtonOnContent?: string;
  styleButtonOnDone?: string;
  onShow?: () => void;
  closeButton?: boolean;



}

export type CoachmarkViewProps = {
  renderArrow: ({
    x,
    position,
    arrowOffset,
  }: {
    x: number;
    position?: CoachmarkPosition;
    arrowOffset?: number;
  }) => React.ReactElement<CoachmarkArrowProps>;
  title?: string;
  leadingIcon?: any;
  onNext: () => void;
  onSkip: () => void;
  onPrev: () => void;
  buttonNextText?: string;
  buttonPrevText?: string;
  buttonSkipText?: string;
  step?: string;
  styleButtonOnContent?: string;
  styleButtonOnDone?: string;


} & CoachmarkContentProps &
  CoachmarkArrowProps;
