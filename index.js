/**
 * @format
 */
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { polyfill as blobPolyfill } from 'react-native-blob-util';

if (!global.Blob) {
  global.Blob = blobPolyfill.Blob;
}

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
