import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { ReminderParamList } from 'types/navigation';
import { createStackNavigator } from '@react-navigation/stack';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {NewReminder, DetailsReminder, ListReminderOverview} from '../../screens'
import { useEffect, useMemo, useRef } from 'react';
import { Button } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { FormReminderState, resetFormReminder, setDefaultList } from '@/store/formReminder';
import { useTheme } from '@/hooks';
import { BottomSheetProvider } from '@/components/Context/BottomSheetContext';
import { ListState } from '@/store/list/list.type';
import { addReminder } from '@/store/reminder/reminder.thunk';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useNotifee } from '@/hooks/useNotifee';
import { EARLY_REMINDER, REPEAT } from '@/types/enum';

const SheetStack = createStackNavigator<ReminderParamList>();

export default function NewReminderSheet({ navigation }: any) {
  //theme
  const {Layout, Colors, NavigationTheme, darkMode: isDark} = useTheme()
  const {colors} = NavigationTheme
  //store
  const {lists} = useSelector((state: {list: ListState}) => state.list)
  const {formReminder} = useSelector((state: {formReminder: FormReminderState}) => state.formReminder);
  const dispatch = useAppDispatch();
  //hook
  const {createReminderNotification, pushEarlyNotificationReminder} = useNotifee()
  //react hooks
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['95%'], []);

  useEffect(() => {
    sheetRef.current?.expand();
    dispatch(setDefaultList({ list: lists[0]}))
  }, []);

  const handleCloseBottomSheet = () => {
    sheetRef.current?.close();
    navigation.goBack()
  }

  const handleBackScreenBefore = () => {
    
  }

  const handleCreateNewReminder = async () => {
    const newReminder = await dispatch(addReminder({
      completed: false,
      completedAt: null,
      listId: formReminder.list ? formReminder.list.id : '',
      ...formReminder
    })).unwrap()
    handleCloseBottomSheet()
    if(newReminder.detail?.repeat !== REPEAT.NOTHING) {
      await createReminderNotification(newReminder)
    }
    if(newReminder.detail?.earlyReminder !== EARLY_REMINDER.NOTHING) {
      await pushEarlyNotificationReminder(newReminder)
    }
    dispatch(resetFormReminder())
  }
  
  return (
    <View 
      style={[
        Layout.fill, 
        isDark ? Layout.backdropDark : Layout.backdrop
      ]}
    >
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={{ display: 'none' }}
        backgroundStyle={{
          backgroundColor: colors.card
        }}
        // onClose={() => navigation.goBack()}
      >
        <BottomSheetView style={Layout.fill}>
          <BottomSheetProvider value={{ handleBackScreenBefore }}>
            <NavigationContainer theme={NavigationTheme} independent>
              <SheetStack.Navigator screenOptions={{ headerShown: false }}>
                <SheetStack.Screen 
                  name="NewReminder" 
                  component={NewReminder}
                  options={{
                    headerShown: true,
                    title: 'New reminder', 
                    headerTitleAlign: 'center',
                    headerTitleStyle: {color: isDark ? Colors.white : '#292929'},
                    headerLeft: () => (
                      <Button 
                        title="Cancel" 
                        type="clear"
                        buttonStyle={{ marginLeft: 8 }}
                        onPress={handleCloseBottomSheet}
                      />
                    ),
                    headerRight: () => (
                      <Button 
                        title="Create" 
                        type="clear" 
                        buttonStyle={{marginRight: 8}}
                        onPress={handleCreateNewReminder}
                        disabled={!formReminder.title}
                      />
                    ),
                  }}
                />
                <SheetStack.Screen 
                  name="DetailsReminder" 
                  component={DetailsReminder} 
                  options={{
                    headerShown: true,
                    title: 'Details', 
                    headerTitleAlign: 'center',
                    headerTitleStyle: {color: isDark ? Colors.white : '#292929'},
                  }}
                />
                <SheetStack.Screen 
                  name="ListReminderOverview" 
                  component={ListReminderOverview} 
                  options={{
                    headerShown: true,
                    title: 'Lists', 
                    headerTitleAlign: 'center',
                    headerTitleStyle: {color: isDark ? Colors.white : '#292929'},
                    headerBackTitle: 'New reminder', // <- chính là nút "< Lists"
                    headerBackTitleVisible: true,
                    headerTintColor: '#007AFF',
                    headerBackTitleStyle: {fontSize: 14},
                  }}
                />
              </SheetStack.Navigator>
            </NavigationContainer>
          </BottomSheetProvider>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
