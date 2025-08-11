import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { AddListParamList } from 'types/navigation';
import { createStackNavigator } from '@react-navigation/stack';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {AddList} from '../../screens'
import { useEffect, useMemo, useRef } from 'react';
import { Button } from '@rneui/themed';
import { BottomSheetProvider } from '@/components/Context/BottomSheetContext';
import { useTheme } from '@/hooks';

const SheetStack = createStackNavigator<AddListParamList>();

export default function AddListSheet({ navigation }: any) {
  //theme
  const { Layout, Colors, NavigationTheme, darkMode: isDark } = useTheme();
  const { colors } = NavigationTheme;

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
        <BottomSheetView style={Layout.fill}>
          <BottomSheetProvider value={{ handleCloseBottomSheet }}>
            <NavigationContainer theme={NavigationTheme} independent>
              <SheetStack.Navigator screenOptions={{ headerShown: false }}>
                <SheetStack.Screen 
                  name="AddList"
                  component={AddList}
                  options={{
                    headerShown: true,
                    title: 'New list', 
                    headerTitleAlign: 'center',
                    headerTitleStyle: {color: isDark ? Colors.white : '#292929'},
                    headerLeft: () => (
                      <Button 
                        title="Cancel" 
                        type="clear"
                        buttonStyle={{ marginLeft: 8 }}
                        onPress={handleCloseBottomSheet}
                      />
                    )
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
