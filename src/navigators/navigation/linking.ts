import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { buildDeepLinkFromNotificationData } from './buildDeepLink';
import { LinkingOptions } from '@react-navigation/native';
import { SCHEMA_LINK } from '@/constants';

export const linking = {
  prefixes: [`${SCHEMA_LINK}://`],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Reminders: 'reminders/:listId',
        },
      },
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) return url;

    const message = await messaging().getInitialNotification();
    return buildDeepLinkFromNotificationData(message?.data);
  },
  subscribe(listener: (url: string) => void) {
    const handleURL = ({ url }: { url: string }) => {
      listener(url);
    };

    const linkingSub = Linking.addEventListener('url', handleURL);

    const unsubscribeFCM = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (url) listener(url);
    });

    return () => {
      linkingSub.remove();
      unsubscribeFCM();
    };
  },
} as LinkingOptions<ReactNavigation.RootParamList>;
