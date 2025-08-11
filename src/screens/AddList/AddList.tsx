import ListForm from '@/components/ListForm/ListForm';
import { SafeAreaView } from 'react-native';
import { COLORS_NEW_LIST, ICONS_NEW_LIST } from '@/constants';
import { useCallback, useLayoutEffect, useState } from 'react';
import { IList } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import { useBottomSheet } from '@/components/Context/BottomSheetContext';
import { addList } from '@/store/list/list.thunk';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTheme } from '@/hooks';

export default function AddList() {
  //theme
  const {Layout} = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { handleCloseBottomSheet } = useBottomSheet();
  //react hooks
  const [formNewList, setFormNewList] = useState<Omit<IList, 'id'>>({
    name: '',
    iconColor: COLORS_NEW_LIST[0],
    iconName: ICONS_NEW_LIST[0],
  });

  //life cycle
  useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => (
          <Button 
            title="Create" 
            type="clear" 
            buttonStyle={{marginRight: 8}}
            onPress={handSaveFormNewList}
            disabled={!formNewList.name}
          />
        ),
    });
  }, [navigation, formNewList]);

  //func
  const handleChangeFormNewList = useCallback(<K extends keyof IList>(
    field: K,
    value: IList[K]
  ) => {
    setFormNewList((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handSaveFormNewList = () => {
    dispatch(addList(formNewList));
    handleCloseBottomSheet && 
    handleCloseBottomSheet();
  }

  return (
    <SafeAreaView style={Layout.fill}>
      <ListForm {...formNewList} onChangeFormList={handleChangeFormNewList}/>
    </SafeAreaView>
  );
}

