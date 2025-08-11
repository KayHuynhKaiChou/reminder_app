import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { DetailReminderParamList } from 'types/navigation';
import { createStackNavigator } from '@react-navigation/stack';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { DetailsReminder, ListReminderOverview } from '../../screens'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultList } from '@/store/formReminder';
import { useTheme } from '@/hooks';
import { BottomSheetProvider } from '@/components/Context/BottomSheetContext';
import { ListState } from '@/store/list/list.type';

const SheetStack = createStackNavigator<DetailReminderParamList>();

export default function DetailsReminderSheet({ navigation, route }: any) {
  //theme
  const { Layout, Colors, NavigationTheme, darkMode: isDark } = useTheme();
  const { colors } = NavigationTheme;
  
  //route
  const { reminderId } = route.params;
  //store
  const {lists} = useSelector((state: {list: ListState}) => state.list)
  
  const dispatch = useDispatch();
  //react hooks
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['95%'], []);

  //life cycle
  useLayoutEffect(() => {
    sheetRef.current?.expand();    
  },[])

  useEffect(() => {
    if(reminderId) return;
    dispatch(setDefaultList({ list: lists[0]}))
  }, []);

  const handleCloseBottomSheet = () => {
    sheetRef.current?.close();
    navigation.goBack()
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
          <BottomSheetProvider value={{ handleCloseBottomSheet }}>
            <NavigationContainer theme={NavigationTheme} independent>
              <SheetStack.Navigator screenOptions={{ headerShown: false }}>
                <SheetStack.Screen 
                  name="DetailsReminder" 
                  component={DetailsReminder} 
                  initialParams={{ reminderId }}
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
                    title: 'List', 
                    headerTitleAlign: 'center',
                    headerTitleStyle: {color: isDark ? Colors.white : '#292929'},
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

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
