import React, { Component } from 'react';
import { Animated } from 'react-native';

export default class CFadeInView extends Component {
   state = {
      fadeAnim: new Animated.Value(0)
   };

   componentDidMount() {
      Animated.timing(
         this.state.fadeAnim,
         {
            toValue: 1,
            duration: 'duration' in this.props ? this.props.duration : 150
         }
      ).start();
   };

   render() {
      let { fadeAnim } = this.state;
      let { style } = this.props;

      return (
         <Animated.View style={{ opacity: fadeAnim, ...style }}>
            {this.props.children}
         </Animated.View>
      );
   };
};
