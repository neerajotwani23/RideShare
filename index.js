/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-get-random-values'

import Geolocation from '@react-native-community/geolocation'
if (Platform.OS !== 'web') {
  global.navigator.geolocation = Geolocation
}

AppRegistry.registerComponent(appName, () => App);
