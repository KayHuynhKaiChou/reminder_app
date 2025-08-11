import ListForm from '@/components/ListForm/ListForm';
import { SafeAreaView } from 'react-native';
import { COLORS_NEW_LIST, ICONS_NEW_LIST } from '@/constants';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { IList } from '@/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { generateUuid } from '@/utils';
import { UpdateListParamList } from 'types/navigation';
import { ListState } from '@/store/list/list.type';
import { updateList } from '@/store/list/list.thunk';
import { useAppDispatch } from '@/hooks/useAppDispatch';

interface AddListProps {
  onCloseBottomSheet: () => void;
}

export default function UpdateList({
    onCloseBottomSheet
}: AddListProps) {
  //route
  const route = useRoute<RouteProp<UpdateListParamList, "UpdateList">>();
  const {listId} = route.params;
  //navigate
  const navigation = useNavigation();
  //store
  const lists = useSelector((state: {list: ListState}) => state.list.lists);
  const dispatch = useAppDispatch();
  //react hooks
  const [formList, setFormList] = useState<IList>({
    id: generateUuid(),
    name: '',
    iconColor: COLORS_NEW_LIST[0],
    iconName: ICONS_NEW_LIST[0],
  });

  //life cycle
  useEffect(() => {
    const foundList = lists.find((list) => list.id === listId);
    if (foundList) {
      setFormList(foundList);
    }
  },[])

  useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => (
            <Button 
                buttonStyle={{width: 80}}
                title="Update" 
                type="clear"
                onPress={handSaveFormList}
                disabled={!formList.name}
            />
        ),
    });
  }, [navigation, formList]);

  //func
  const handleChangeFormList = useCallback(<K extends keyof IList>(
    field: K,
    value: IList[K]
  ) => {
    setFormList((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handSaveFormList = () => {
    dispatch(updateList(formList));
    onCloseBottomSheet();
  }

  return (
    <SafeAreaView>
      <ListForm {...formList} onChangeFormList={handleChangeFormList}/>
    </SafeAreaView>
  );
}

