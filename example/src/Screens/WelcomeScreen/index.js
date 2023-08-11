import React from 'react';
import { connect } from 'react-redux';

import RenderMobile from './render';

class WelcomeScreen extends React.Component {
   state = {
      isLoading: false
   };

   render() {
      const { navigation, isOnboarding } = this.props;
      const { isLoading } = this.state;

      return (
         <RenderMobile
            isLoading={isLoading}
            navigation={navigation}
            isOnboarding={isOnboarding}
         />
      );
   };
};

const mapStateToProps = state => {
   const {
      globalData,
      isOnboarding
   } = state;
   return {
      globalData,
      isOnboarding
   };
};

export default connect(mapStateToProps)(WelcomeScreen);