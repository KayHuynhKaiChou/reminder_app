import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { HomeState, updateTokenDevice } from '@/store/home';
import firestore from "@react-native-firebase/firestore";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const fcmToken = useSelector((state: {home: HomeState}) => state.home.fcmToken)
  
  const requestUserPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('✅ Notification permission granted');
      } else {
        console.log('❌ Notification permission denied');
      }
    }
  };

  // Lấy FCM Token
  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      const tokenDoc = await firestore()
        .collection("fcm-token")
        .add({
          value: token
        });
      dispatch(updateTokenDevice({ 
        fcmToken: { 
          id: tokenDoc.id, 
          value: token
        } 
      }))
      console.log('FCM Token:', token);
      // Bạn có thể gửi token này về server tại đây
    } catch (error) {
      console.error('Failed to get FCM Token:', error);
    }
  };

  const listenForMessages = () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground FCM Message:', remoteMessage.data);
      Toast.show({
        type: 'info',
        text1: remoteMessage.notification?.title,
        text2: remoteMessage.notification?.body,
      })
      // Alert.alert(remoteMessage.notification?.title || 'title', remoteMessage.notification?.body);
    });

    return unsubscribe;
  };

  useEffect(() => {
    requestUserPermission()
      .then(() => {
        if( fcmToken.id && fcmToken.value ) return;
        getToken()
      })
    const unsubscribe = listenForMessages();
    return unsubscribe;
  }, []);
};