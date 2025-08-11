import 'whatwg-fetch';
import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((config, reducers) => reducers),
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Firebase firestore mock
jest.mock('@react-native-firebase/firestore', () => {
  return jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
      })),
    })),
  }));
});

// Firebase App mock
jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn(),
  app: jest.fn(() => ({
    name: '[DEFAULT]',
    options: {},
  })),
  apps: [],
}));

jest.mock('@react-native-firebase/messaging', () => ({
  requestPermission: jest.fn(() => Promise.resolve(true)),
  hasPermission: jest.fn(() => Promise.resolve(true)),
  getToken: jest.fn(() => Promise.resolve('fake-device-token')),
  onTokenRefresh: jest.fn(() => jest.fn()),
  onMessage: jest.fn(() => jest.fn()),
  setBackgroundMessageHandler: jest.fn(),
  deleteToken: jest.fn(() => Promise.resolve()),
  isDeviceRegisteredForRemoteMessages: jest.fn(() => Promise.resolve(true)),
  registerDeviceForRemoteMessages: jest.fn(() => Promise.resolve()),
  unregisterDeviceForRemoteMessages: jest.fn(() => Promise.resolve()),
}));


jest.mock('@notifee/react-native', () => ({
  onForegroundEvent: jest.fn(),
  onBackgroundEvent: jest.fn(),
  displayNotification: jest.fn(),
  createChannel: jest.fn(),
  requestPermission: jest.fn(),
  getNotificationSettings: jest.fn(),
  setNotificationCategories: jest.fn(),
  cancelAllNotifications: jest.fn(),
  getInitialNotification: jest.fn(),
}));

jest.mock('react-native-keyboard-controller', () => ({
  KeyboardController: {
    setInputMode: jest.fn(),
    inputMode: {
      automatic: 'automatic',
      pan: 'pan',
      resize: 'resize',
      none: 'none',
    },
  },
}));

jest.mock('react-native-geolocation-service', () => ({
  requestAuthorization: jest.fn(),
  getCurrentPosition: jest.fn((success, error, options) => {
    // Giả lập trả về vị trí giả lập
    success({
      coords: {
        latitude: 10.762622,
        longitude: 106.660172,
      },
      timestamp: Date.now(),
    });
  }),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
}));

