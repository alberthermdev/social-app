import { registerRootComponent } from 'expo';
import { preventAutoHideAsync } from 'expo-splash-screen';

import App from './App';

preventAutoHideAsync();

registerRootComponent(App);
