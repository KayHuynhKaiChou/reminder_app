import ListReminderItem from '../ListReminder/ListReminderItem';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import EmptyList from '../EmptyList/EmptyList';
import ListSwipeItem from '../ListReminder/ListSwipeItem';
import { useTheme } from '@/hooks';
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { Divider } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { HomeState } from '@/store/home';
import { Swipeable } from 'react-native-gesture-handler';
import { IList, NavigationHomeProp } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { ListState } from '@/store/list/list.type';
import { removeList } from '@/store/list/list.thunk';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { removeMultipleReminderByListId } from '@/store/reminder/reminder.thunk';
import { updateOrderLists } from '@/store/list/list.slice';
import { useCallback, useRef } from 'react';

export default function MyListsReminder() {
    //hook
    const {
      Layout,
      Fonts,
      Colors,
      darkMode: isDark
    } = useTheme();
    const navigation = useNavigation<NavigationHomeProp>();
    const isEdit = useSelector((state: {home: HomeState}) => state.home.isEdit)
    const {lists: data} = useSelector((state: {list: ListState}) => state.list)
    const dispatch = useAppDispatch();
    //ref
    const openSwipeableRef = useRef<Swipeable | null>(null);
    
    //func
    const handleSwipeOpen = useCallback((ref: Swipeable) => {
      if (openSwipeableRef.current && openSwipeableRef.current !== ref) {
        openSwipeableRef.current.close();
      }
      openSwipeableRef.current = ref;
    }, []);

    const handleUpdateListReminder = (updatedData: IList[]) => {
      dispatch(updateOrderLists({lists: updatedData}))
    }
    const handleNavigateListDetail = (id: IList['id']) => {
      navigation.navigate("UpdateListSheet", {listId: id})
    }
    const handleDeleteList = (id: IList['id']) => {
      dispatch(removeList(id))
      dispatch(removeMultipleReminderByListId(id))     
    }
    
    return (
      <View testID='title-header-list-reminders' style={[Layout.fill]}>
        <Text style={[Fonts.titleSmall, styles.titleHeader]}>My Lists</Text>
        {isEdit ? (
          <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => handleUpdateListReminder(data)}
            contentContainerStyle={
              data.length > 0 
                ? [
                  styles.listReminderContainer,
                  {backgroundColor: isDark ? Colors.textGray600 : '#fff'}
                ] 
                : {flexGrow: 1}
            }            
            keyExtractor={item => item.id}
            renderItem={
              ({getIndex, item, drag}) => (
                <ScaleDecorator activeScale={1.05}>
                  <ListReminderItem testID={`list-reminder-${getIndex()}`} listReminderData={item} onDrag={drag}/>
                </ScaleDecorator>
              )
            }
            scrollEnabled={false} // false thi ScrollView co the 
            ItemSeparatorComponent={() => <Divider style={styles.divider}/>}
            ListEmptyComponent={
              () => <EmptyList content='No Lists' />
            }
          />
        ) : (
          <FlatList
            data={data}
            contentContainerStyle={
              data.length > 0 
                ? [
                  styles.listReminderContainer,
                  {backgroundColor: isDark ? Colors.textGray600 : '#fff'}
                ] 
                : {flexGrow: 1}
            }
            keyExtractor={item => item.id}
            renderItem={
              ({item, index}) => (
                <ListSwipeItem 
                  testID={`list-reminder-${index}`}
                  list={item} 
                  onDeleteList={handleDeleteList} 
                  onNavigateListDetail={handleNavigateListDetail} 
                  onSwipeOpen={handleSwipeOpen}
                />
              )
            }
            scrollEnabled={false} // false thi ScrollView co the 
            ItemSeparatorComponent={() => <Divider style={styles.divider}/>}
            ListEmptyComponent={
              () => 
                <EmptyList 
                  content='No Lists' 
                  subContent='Please press add list button to create new list'
                />
            }
          />
        )}
      </View>
    )
}

const styles = StyleSheet.create({
  titleHeader: {
    padding: 10
  },
  listReminderContainer: {
    borderRadius: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 60 // 40 width icon + 10 gap + 10 padding left
  },
  infoBtn: {
    width: 50,
    backgroundColor: 'gray',
  },
  deleteBtn: {
    width: 50,
    backgroundColor: 'red'
  },
})
