import { Platform, Alert } from 'react-native';
import { createMemoryHistory, createBrowserHistory } from 'history';
/**
 *
 * @param {*} navName
 * @param {*} params
 * @param {props} props required
 */

export const NavigateTo = (navName, params = false, props = false) => {
   if (!props) { 
      return Alert.alert("Props is required")
   }

   setTimeout(() => {
      props.navigation.navigate(navName, params)
   }, 200);
}
