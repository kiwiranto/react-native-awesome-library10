import { NavigationActions } from 'react-navigation';
import { Animated, Easing } from 'react-native';
import { SET_NAVIGATION } from '../Config/Reducer';
import { store } from '../Config/Store';

let _navigator;
let _navigatorTimer;

export const setContainer = (navigatorRef) => {
   _navigator = navigatorRef;

   clearInterval(_navigatorTimer);
   _navigatorTimer = setInterval(() => {
      if (_navigator) {
         const _currentNavigation = currentNavigation();
         if (_currentNavigation != store.getState().navCleanName) {
            store.dispatch({
               type: SET_NAVIGATION,
               nav: navigatorRef.state.nav,
               cleanName: _currentNavigation,
            });
         }
      }
   }, 300);
};

export const navigate = (routeName, params) => {
   if (_navigator) {
      _navigator.dispatch(
         NavigationActions.navigate({
            routeName,
            params,
         })
      );
   }
};

export const currentNavigation = () => {
   try {
      const getCurrentRoute = (state) => {
         const findCurrentRoute = (navState) => {
            if (navState.index !== undefined) {
               return findCurrentRoute(navState.routes[navState.index]);
            }
            return navState.routeName;
         };
         return findCurrentRoute(state.nav);
      };

      const stateNav = _navigator.state;
      return getCurrentRoute(stateNav);
   } catch (error) {
      return false;
   }
};

export const NavigationAnimationRightToLeft = () => {
   return {
      transitionSpec: {
         duration: 500,
         easing: Easing.out(Easing.poly(4)),
         timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
         const { layout, position, scene } = sceneProps;
         const { index } = scene;

         const width = layout.initWidth;
         const translateX = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [width, 0, 0],
         });

         const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index],
            outputRange: [0, 1, 1],
         });

         return { opacity, transform: [{ translateX: translateX }] };
      },
   };
};