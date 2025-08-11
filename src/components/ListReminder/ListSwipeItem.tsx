import { useTheme } from '@/hooks';
import { IList } from '@/types';
import { Icon } from '@rneui/themed';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useRef } from 'react';
import ListReminderItem from './ListReminderItem';

interface IListSwipeItem {
  testID: string;
  list: IList;
  onDeleteList: (id: string) => void;
  onNavigateListDetail: (id: string) => void;
  onSwipeOpen: (swipeable: Swipeable) => void;
}

export default function ListSwipeItem({
  testID,
  list,
  onDeleteList,
  onNavigateListDetail,
  onSwipeOpen,
}: IListSwipeItem) {
    
  //hook
  const { Layout } = useTheme();

  //ref
  const swipeableRef = useRef<Swipeable>(null);

  //func
  const handleSwipeOpen = () => {
    if (swipeableRef.current) {
      onSwipeOpen && onSwipeOpen(swipeableRef.current);
    }
  };
  const GroupBtnRight = ({ id, dragX }: { id: string; dragX: any }) => {
    const translateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          Layout.rowVCenter,
          {
            alignItems: 'stretch',
            transform: [{ translateX }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.infoBtn, Layout.rowCenter]}
          onPress={() => onDeleteList(id)}
        >
          <Icon name="info" color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteBtn, Layout.rowCenter]}
          onPress={() => onNavigateListDetail(id)}
        >
          <Icon name="delete" color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={(progress, dragX) => (
        <GroupBtnRight id={list.id} dragX={dragX} />
      )}
      onSwipeableWillOpen={handleSwipeOpen}
    >
      <ListReminderItem testID={testID} listReminderData={list} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  infoBtn: {
    width: 50,
    backgroundColor: 'gray',
  },
  deleteBtn: {
    width: 50,
    backgroundColor: 'red',
  },
});
