import React, { useEffect } from 'react';
import {
  Home,
  Reminders,
  NewReminderSheet,
  CompletedReminder,
  DetailsReminderSheet,
  AddListSheet,
  UpdateListSheet,
  TodayReminder,
  AllReminder,
  FlaggedReminder
} from '../screens';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { MainParamsList } from 'types/navigation';
import notifee, { EventDetail, EventType } from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationHomeProp } from '@/types';
import { useNotifee } from '@/hooks/useNotifee';
import { useSelector } from 'react-redux';
import { ReminderState } from '@/store/reminder/reminder.type';

const Stack = createStackNavigator<MainParamsList>();

// @refresh reset
const MainNavigator = () => {
  const { rescheduleReminder } = useNotifee();
  const navigation = useNavigation<NavigationHomeProp>();
  const reminders = useSelector((state: {reminder: ReminderState}) => state.reminder.reminders);

  //func
  const handleReschedule = async (detail: EventDetail) => {
    const { reminderId, isRepeated } = detail.notification?.data ?? {};
    const isRepeatedParse = JSON.parse(isRepeated as string)
    const foundReminder = reminders.find((reminder) => reminder.id === reminderId);

    if (foundReminder && isRepeatedParse) {
      await rescheduleReminder(foundReminder, isRepeatedParse);
    }
  };

  // khi bấm nút home để thoát app , nhưng chưa kill app sẽ run
  useEffect(() => {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.DELIVERED) {
        console.log('Notification delivered background');
        handleReschedule(detail);
      }
    });
  }, [reminders]);
  
  //khi app đang mở
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification?.data?.listId) {
        console.log('Notification pressed navigate');
        navigation.navigate('Reminders', {
          listId: detail.notification.data.listId as string,
        });
      }

      if (type === EventType.DELIVERED) {
        console.log('Notification delivered');
        handleReschedule(detail);
      }
    });

    // Khi app được mở từ trạng thái quit
    notifee.getInitialNotification().then(initial => {
      // console.log('Initial notification');
      // if (initial?.notification?.data) {
      //   const {listId, reminderId, repeat} = initial?.notification?.data || {}
      //   rescheduleReminder(reminderId, repeat)
      //     .then(() => {
      //       navigation.navigate('Reminders', {
      //         listId,
      //       });
      //     });
      // }
    });

    return () => unsubscribe();
  }, [reminders]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // navigate sang screen khac tu right to left va goback thi nguoc lai
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="NewReminderSheet"
        component={NewReminderSheet}
        options={{
          presentation: 'transparentModal',
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="Reminders"
        component={Reminders}
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: 'Lists', // <- chính là nút "< Lists"
          headerBackTitleVisible: true,
          headerTintColor: '#007AFF',
        }}
      />
      <Stack.Screen
        name="CompletedReminder"
        component={CompletedReminder}
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: 'Home', // <- chính là nút "< Lists"
          headerBackTitleVisible: true,
          headerTintColor: '#007AFF',
        }}
      />
      <Stack.Screen
        name="TodayReminder"
        component={TodayReminder}
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: 'Home', // <- chính là nút "< Lists"
          headerBackTitleVisible: true,
          headerTintColor: '#007AFF',
        }}
      />
      <Stack.Screen
        name="AllReminder"
        component={AllReminder}
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: 'Home', // <- chính là nút "< Lists"
          headerBackTitleVisible: true,
          headerTintColor: '#007AFF',
        }}
      />
      <Stack.Screen
        name="FlaggedReminder"
        component={FlaggedReminder}
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: 'Home', // <- chính là nút "< Lists"
          headerBackTitleVisible: true,
          headerTintColor: '#007AFF',
        }}
      />
      <Stack.Screen
        name="DetailsReminderSheet"
        component={DetailsReminderSheet}
        options={{
          presentation: 'transparentModal',
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="AddListSheet"
        component={AddListSheet}
        options={{
          presentation: 'transparentModal',
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="UpdateListSheet"
        component={UpdateListSheet}
        options={{
          presentation: 'transparentModal',
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
