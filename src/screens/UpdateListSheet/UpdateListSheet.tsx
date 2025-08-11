import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { UpdateListParamList } from 'types/navigation';
import { createStackNavigator } from '@react-navigation/stack';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {UpdateList} from '../../screens'
import { useEffect, useMemo, useRef } from 'react';
import { Button } from '@rneui/themed';
import { useTheme } from '@/hooks';

const SheetStack = createStackNavigator<UpdateListParamList>();

export default function UpdateListSheet({ navigation, route }: any) {
  //theme
  const { Layout, Colors, NavigationTheme, darkMode: isDark } = useTheme();
  const { colors } = NavigationTheme;

  //route
  const { listId } = route.params;

  //react hooks
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['95%'], []);

  useEffect(() => {
    sheetRef.current?.expand();
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
        <BottomSheetView style={{ flex: 1 }}>
          <NavigationContainer theme={NavigationTheme} independent>
            <SheetStack.Navigator screenOptions={{ headerShown: false }}>
              <SheetStack.Screen 
                name="UpdateList"
                initialParams={{ listId }}
                options={{
                  headerShown: true,
                  title: 'List information', 
                  headerTitleAlign: 'center',
                  headerTitleStyle: {color: isDark ? Colors.white : '#292929'},
                  headerLeft: () => (
                    <Button 
                      title="Cancel" 
                      type="clear"
                      // buttonStyle={{ marginLeft: 8 }}
                      onPress={handleCloseBottomSheet}
                    />
                  ),
                  headerRight: () => (
                    <Button 
                      title="End" 
                      type="clear"
                      onPress={handleCloseBottomSheet}
                    />
                  ),
                }}
              >
                {() => <UpdateList onCloseBottomSheet={handleCloseBottomSheet}/>}
              </SheetStack.Screen>
            </SheetStack.Navigator>
          </NavigationContainer>
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
