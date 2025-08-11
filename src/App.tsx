import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store, persistor } from './store';
import ApplicationNavigator from './navigators/Application';
import './translations';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import Toast, { BaseToast } from 'react-native-toast-message';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { LogBox } from 'react-native';

const toastConfig = {
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#3498db', backgroundColor: '#ecf0f1' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
      }}
      text2Style={{
        fontSize: 14,
        color: '#34495e',
      }}
    />
  ),
  // Bạn cũng có thể custom error/success ở đây nếu cần
};

LogBox.ignoreAllLogs(true);

const App = () => {
  
  return <Provider store={store}>
    {/**
     * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
     * and saved to redux.
     * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
     * for example `loading={<SplashScreen />}`.
     * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
     */}
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <MenuProvider>
            <KeyboardProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ApplicationNavigator />
                <Toast config={toastConfig}/>
              </GestureHandlerRootView>
            </KeyboardProvider>
          </MenuProvider>
        </SafeAreaProvider>
      </PersistGate>
  </Provider>
};

export default App;
