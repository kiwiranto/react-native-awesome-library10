import 'react-native-gesture-handler';
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { setContainer } from './Navigator.mobile';

import LoginLanguageScreen from '../Screens/LoginLanguangeScreen';
import WelcomeScreen from '../Screens/WelcomeScreen';

/* Login Stack Navigator */
const LoginRegisterNav = createStackNavigator(
   {
      LoginLanguage: {
         screen: LoginLanguageScreen,
         navigationOptions: {
            headerShown: false
         }
      }
   },
   {
      headerMode: 'none',
      initialRouteName: 'LoginLanguage'
   }
);

/* Onboarding Stack Navigator */
const OnboardingNav = createStackNavigator(
   {
      Welcome: {
         screen: WelcomeScreen
      }
   },
   {
      headerMode: 'none',
      initialRouteName: 'Welcome'
   }
);

const NavData = {
   LoginCore: LoginRegisterNav,
   OnboardingCore: OnboardingNav
};

/* Switch Navigator */
const CoreNav = createSwitchNavigator(
   NavData,
   {
      initialRouteName: 'LoginCore'
   }
);


const MobileNavigator = createAppContainer(CoreNav);

const InitAuth = () => {

   return (
      <MobileNavigator
         ref={(navigatorRef) => {
            setContainer(navigatorRef);
         }}
      />
   );
};

export default InitAuth;
