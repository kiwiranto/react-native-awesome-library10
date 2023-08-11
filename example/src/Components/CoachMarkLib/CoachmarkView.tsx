import React, { Component } from 'react';
import CoachmarkContent from './CoachmarkContent';
import CoachmarkArrow from './CoachmarkArrow';
import { CoachmarkPosition, CoachmarkViewProps } from './types';

export default class CoachmarkView extends Component<CoachmarkViewProps> {
  static defaultProps: Pick<CoachmarkViewProps, 'position' | 'renderArrow'> = {
    position: CoachmarkPosition.TOP,
    renderArrow: ({ x, position, arrowOffset }) => <CoachmarkArrow x={x} position={position} arrowOffset={arrowOffset} />
  };

  renderCoachmarkContent() {
    const { message, title, leadingIcon, buttonOnContent, onNext, onPrev, buttonNextText, buttonPrevText, step, styleButtonOnContent, closeButton, onSkip, buttonOnDone, styleButtonOnDone } = this.props;
    return (
      <CoachmarkContent
        title={title}
        message={message}
        leadingIcon={leadingIcon}
        buttonOnContent={buttonOnContent}
        onNext={onNext}
        onSkip={onSkip}
        buttonNextText={buttonNextText}
        onPrev={onPrev}
        buttonPrevText={buttonPrevText}
        step={step}
        styleButtonOnContent={styleButtonOnContent}
        buttonOnDone={buttonOnDone}
        styleButtonOnDone={styleButtonOnDone}
        closeButton={closeButton}

      />
    );
  }

  renderCoachmarkArrow() {
    const { renderArrow, x, position, arrowOffset } = this.props;
    return renderArrow({ x, position, arrowOffset });
  }

  // _handleOnNext = () => {
  //   this.props.onNext()
  //   this.props.handleHide()
  // }

  // _handleOnSkip = () => {
  //   this.props.onSkip()
  //   this.props.handleHide()
  // }

  // renderNavigationCoachmark(){
  //   return(
  //     <View style={{paddingVertical : 12, paddingHorizontal : 24, flexDirection : 'row-reverse'}}>
  //       <TouchableOpacity onPress={this._handleOnNext}>
  //         <View style={{backgroundColor : 'red', paddingHorizontal : 32, paddingVertical : 8, borderRadius : 50}}>
  //           <Text style={{color : 'white', fontWeight : 'bold', fontSize : 16}}>{this.props.buttonNextText || "Next"}</Text>
  //         </View>
  //       </TouchableOpacity>

  //       {!this.props.isHideSkipButton && (
  //         <TouchableOpacity onPress={this._handleOnSkip} >
  //           <View style={{paddingHorizontal : 32, paddingVertical : 8}}>
  //             <Text style={{color : 'white', fontWeight : 'bold', fontSize : 16}}>{this.props.buttonSkipText || "Skip"}{" >"}</Text>
  //           </View>
  //         </TouchableOpacity>
  //       )}
  //     </View>
  //   )
  // }

  render() {
    const { position } = this.props;
    return position === CoachmarkPosition.TOP ? (
      <>
        {this.renderCoachmarkArrow()}
        {this.renderCoachmarkContent()}
        {/* {this.renderNavigationCoachmark()} */}
      </>
    ) : (
      <>
        {/* {this.renderNavigationCoachmark()} */}
        {this.renderCoachmarkContent()}
        {this.renderCoachmarkArrow()}
      </>
    );
  }
}
