import ImageViewing from 'react-native-image-viewing';
import dayjs from 'dayjs';
import { useTheme } from '@/hooks';
import {
  IList,
  IReminder,
  IFormReminder,
  NavigationRemindersProp,
} from '@/types';
import { PRIORITY, REPEAT } from '@/types/enum';
import { capitalizeFirstLetter, formatTime, getDateLabel } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { CheckBox, Icon } from '@rneui/themed';
import { memo, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  removeReminder,
  updateReminder,
} from '@/store/reminder/reminder.thunk';
import { useNotifee } from '@/hooks/useNotifee';

interface IReminderItemProps {
  listId: IList['id'];
  listName?: IList['name'];
  reminderData: IReminder;
  colorList?: IList['iconColor'];
  autoFocus: boolean;
  isUseCompleted?: boolean;
  onHiddenFormCreateReminder?: () => void;
  onSwipeOpen?: (swipeable: Swipeable) => void;
}

const ReminderItem = ({
  listId,
  listName,
  reminderData,
  colorList,
  autoFocus,
  isUseCompleted = false,
  onHiddenFormCreateReminder,
  onSwipeOpen
}: IReminderItemProps) => {
  //props
  const { id, title, content, detail } = reminderData;
  //store
  const dispatch = useAppDispatch();
  //hook
  const navigate = useNavigation<NavigationRemindersProp>();
  const { Layout, Fonts, darkMode: isDark } = useTheme();
  const { cancelNotificationReminder } = useNotifee();
  //ref
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const swipeableRef = useRef<Swipeable>(null);
  //state
  const [visible, setVisible] = useState(false);
  const [indexImage, setIndexImage] = useState(0);
  const [formReminder, setFormReminder] = useState<IFormReminder>({
    title,
    content,
    detail,
  });
  const [completed, setCompleted] = useState(reminderData.completed);
  //memo
  const formatDetailDateTime = useMemo(() => {
    if (!formReminder?.detail?.date && !formReminder?.detail?.time) return '';
    const formatDate = formReminder.detail.date
      ? getDateLabel(formReminder.detail.date)
      : '';
    const formatTimeValue = formReminder.detail.time
      ? formatTime(new Date(formReminder.detail.time))
      : '';
    return formatTimeValue ? `${formatTimeValue} ${formatDate}` : formatDate;
  }, [formReminder.detail]);

  const dateTimeCompleted = useMemo(() => {
    if (!reminderData?.completed || !reminderData?.completedAt) return '';
    const [date, time] = reminderData.completedAt.split('T');
    const formatDate = getDateLabel(date);
    const formatTimeValue = formatTime(new Date(reminderData.completedAt));
    return `Completed at: ${formatTimeValue} ${formatDate}`;
  }, [reminderData.completed]);

  const detailImages = useMemo(() => {
    if (!formReminder?.detail?.images) return [];
    return formReminder.detail.images;
  }, [formReminder.detail?.images]);

  const detailPriority = useMemo(() => {
    if (!formReminder?.detail?.priority) return undefined;
    switch (formReminder.detail.priority) {
      case PRIORITY.NOTHING:
        return undefined;
      case PRIORITY.LOW:
        return '!';
      case PRIORITY.MEDIUM:
        return '!!';
      case PRIORITY.HIGH:
        return '!!!';
    }
  }, [formReminder.detail?.priority]);

  const isShowRepeat = useMemo(() => {
    return (
      formReminder?.detail?.repeat &&
      formReminder.detail.repeat !== REPEAT.NOTHING
    );
  }, [formReminder.detail?.repeat]);

  const isPastDate = useMemo(() => {
    if (!formReminder?.detail?.date || isUseCompleted) return false;
    return dayjs(formReminder.detail.date).isBefore(dayjs());
  }, [formReminder.detail?.date]);

  const colorDetailDateTime = useMemo(() => {
    return isPastDate ? 'red' : isDark ? '#fff' : '#2b2b2b';
  }, [isPastDate]);

  const colorListName = useMemo(() => {
    return isDark ? '#fff' : '#2b2b2b';
  }, []);

  const GroupBtnRight = ({
    progress,
    dragX,
  }: {
    progress: any;
    dragX: any;
  }) => {
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
          onPress={handleNavigateDetails}
        >
          <Icon name="info" color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteBtn, Layout.rowCenter]}
          onPress={handleRemoveReminder}
        >
          <Icon name="delete" color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  //func
  const handleSwipeOpen = () => {
    if (swipeableRef.current) {
      onSwipeOpen && onSwipeOpen(swipeableRef.current);
    }
  };
  const handleNavigateDetails = () => {
    navigate.navigate('DetailsReminderSheet', {
      reminderId: id,
    });
  };
  const handleUpdateFormReminder = <K extends keyof IFormReminder>(
    field: K,
    value: IFormReminder[K],
  ) => {
    setFormReminder({
      ...formReminder,
      [field]: value,
    });
  };
  const handleSaveForm = async () => {
    if (!formReminder.title) {
      await handleRemoveReminder();
    } else {
      await dispatch(
        updateReminder({
          ...reminderData,
          ...formReminder,
        }),
      );
    }
    onHiddenFormCreateReminder &&
    onHiddenFormCreateReminder()
  };
  const handleRemoveReminder = async () => {
    await dispatch(removeReminder(id));
    await cancelNotificationReminder(id);
  };

  const handleCompletedReminder = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newCompleted = !completed;
    setCompleted(newCompleted);
    await cancelNotificationReminder(id);

    timeoutRef.current = setTimeout(async () => {
      await dispatch(
        updateReminder({
          ...reminderData,
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : null,
        }),
      );
    }, 1000);
  };
  const handlePreviewImage = (index: number) => {
    setVisible(true);
    setIndexImage(index);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <>
      {console.log(reminderData.title)}
      <Swipeable
        ref={swipeableRef}
        renderRightActions={(progress, dragX) => (
          <GroupBtnRight progress={progress} dragX={dragX} />
        )}
        onSwipeableWillOpen={handleSwipeOpen}
      >
        <View
          style={[
            Layout.rowHStart,
            Layout.rowVSpaceBetween,
            { paddingVertical: 10 },
          ]}
        >
          <View style={[Layout.row]}>
            <CheckBox
              checked={completed}
              onPress={handleCompletedReminder}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor={isUseCompleted ? undefined : colorList}
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
                padding: 0,
                margin: 0,
                marginTop: 5,
              }}
            />
            <View style={[Layout.col, { width: screenWidth - 100 }]}>
              <View style={[Layout.row, Layout.rowHCenter]}>
                <Text style={[Fonts.textBold, styles.priority]}>
                  {detailPriority}
                </Text>
                <TextInput
                  placeholder="Title"
                  style={[styles.input, { color: colorListName }]}
                  placeholderTextColor={'#afafaf'}
                  value={formReminder.title}
                  autoFocus={autoFocus}
                  onChangeText={text => handleUpdateFormReminder('title', text)}
                  onBlur={handleSaveForm}
                />
              </View>
              <TextInput
                placeholder="Notes"
                style={[styles.input, styles.inputNotes]}
                placeholderTextColor={'#afafaf'}
                value={formReminder.content}
                onChangeText={text => handleUpdateFormReminder('content', text)}
                onBlur={handleSaveForm}
                multiline
              />
              <View style={[styles.textNotInput, Layout.col, Layout.gapSmall]}>
                {listName && (
                  <Text
                    style={[
                      Fonts.textSmall,
                      Fonts.textBold,
                      { color: colorList },
                    ]}
                  >
                    {listName}
                  </Text>
                )}
                <View style={[Layout.row, Layout.rowWrap]}>
                  {formatDetailDateTime && (
                    <Text
                      style={[Fonts.textSmall, { color: colorDetailDateTime }]}
                    >
                      {formatDetailDateTime}
                    </Text>
                  )}
                  {isShowRepeat && formReminder.detail?.repeat && (
                    <>
                      <Text style={{ color: colorDetailDateTime }}>, </Text>
                      <Icon name="repeat" color={colorDetailDateTime} />
                      <Text
                        style={[Fonts.textSmall, { color: colorDetailDateTime }]}
                      >
                        {capitalizeFirstLetter(formReminder.detail.repeat)}
                      </Text>
                    </>
                  )}
                </View>
                {isUseCompleted && (
                  <Text style={[Fonts.textSmall, { color: '#7c7c7c' }]}>
                    {dateTimeCompleted}
                  </Text>
                )}
                {formReminder.detail?.addressDetail && (
                  <View style={[Layout.card]}>
                    <Text style={[Fonts.textSmall]} numberOfLines={1}>
                      {formReminder.detail.addressDetail}
                    </Text>
                  </View>
                )}
                {detailImages.length > 0 && (
                  <View style={[Layout.row, Layout.gapSmall]}>
                    {detailImages.map(({ id, url }, index) => (
                      <View key={id}>
                        <TouchableOpacity
                          onPress={() => handlePreviewImage(index)}
                        >
                          <Image
                            key={id}
                            source={{ uri: url }}
                            style={Layout.imageDetail}
                          />
                        </TouchableOpacity>
                        <ImageViewing
                          images={detailImages.map(item => ({ uri: item.url }))}
                          imageIndex={indexImage}
                          visible={visible}
                          onRequestClose={() => setVisible(false)}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
          {formReminder.detail?.isFlagged && (
            <Icon name="flag" color="#FA9703" style={{ marginRight: 10 }} />
          )}
        </View>
      </Swipeable>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingVertical: 0,
  },
  inputNotes: {
    color: '#7c7c7c',
  },
  textNotInput: {
    marginLeft: 4,
  },
  infoBtn: {
    width: 50,
    backgroundColor: 'gray',
  },
  deleteBtn: {
    width: 50,
    backgroundColor: 'red',
  },
  priority: {
    color: '#ff6a6a',
  },
});

export default memo(ReminderItem)
