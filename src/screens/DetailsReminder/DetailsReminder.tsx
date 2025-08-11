import ReminderToggleItem from '../../components/CardSettingReminder/ReminderToggleItem';
import ReminderLinkItem from '../../components/CardSettingReminder/ReminderLinkItem';
import DetailDateTimePicker from '@/components/DetailDateTimePicker/DetailDateTimePicker';
import DetailImagesReminder from '@/components/DetailImagesReminder/DetailImagesReminder';
import DetailLocation from '@/components/DetailLocation/DetailLocation';
import PopupMenuDetail from '@/components/PopupMenu/PopupMenuDetail';
import dayjs from 'dayjs';
import { Alert, SafeAreaView, Text } from 'react-native';
import { useTheme } from '@/hooks';
import { ScrollView } from 'react-native-gesture-handler';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { IDetailReminderForm, NavigationDetailReminderProp } from '@/types';
import {
  capitalizeFirstLetter,
  checkShowEarlyReminderWarning,
  combineDateAndTime,
  getNextRepeatTime,
  getRoundedTime,
} from '@/utils';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DetailReminderParamList } from 'types/navigation';
import { useSelector } from 'react-redux';
import { FormReminderState, updateFormReminder } from '@/store/formReminder';
import { Button, Icon } from '@rneui/themed';
import { useBottomSheet } from '@/components/Context/BottomSheetContext';
import { EARLY_REMINDER, NOTIFICATION_TYPE, PRIORITY, REPEAT } from '@/types/enum';
import { ReminderState } from '@/store/reminder/reminder.type';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateFieldDetailReminder } from '@/store/reminder/reminder.thunk';
import { useNotifee } from '@/hooks/useNotifee';
import EarlyAndRepeatReminder from '@/components/EarlyAndRepeatReminder/EarlyAndRepeatReminder';
import { MENU_PRIORITY } from '@/constants';
import { ListState } from '@/store/list/list.type';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

export default function DetailsReminder() {
  const { Layout, Colors, darkMode: isDark } = useTheme();

  //store
  const { formReminder } = useSelector(
    (state: { formReminder: FormReminderState }) => state.formReminder,
  );
  const lists = useSelector(
    (state: { list: ListState }) => state.list.lists,
  );
  const reminders = useSelector(
    (state: { reminder: ReminderState }) => state.reminder.reminders,
  );
  const dispatch = useAppDispatch();

  //route
  const route =
    useRoute<RouteProp<DetailReminderParamList, 'DetailsReminder'>>();

  //navigate
  const navigation = useNavigation<NavigationDetailReminderProp>();

  //context
  const { handleCloseBottomSheet } = useBottomSheet();

  //hooks
  const { 
    rescheduleReminder,
    createReminderNotification, 
    pushEarlyNotificationReminder,
    cancelNotificationReminder 
  } = useNotifee();

  //memo
  const isModeUpdate = useMemo(() => !!route.params?.reminderId, []);
  const reminderUpdated = useMemo(
    () => {
      if(!isModeUpdate) return undefined;
      return reminders.find(reminder => reminder.id === route.params?.reminderId)
    },
    [reminders, route.params?.reminderId],
  );

  //func init state
  const initDetailReminderForm = () => {
    const defaultDetailReminderForm = {
      date: dayjs().format('YYYY-MM-DD'),
      time: getRoundedTime(),
      isToggleDate: false,
      isToggleTime: false,
      earlyReminder: EARLY_REMINDER.NOTHING,
      repeat: REPEAT.NOTHING,
      isFlagged: false,
      priority: PRIORITY.NOTHING,
      images: [],
      isToggleLocation: false,
    };
    if (!isModeUpdate && !!formReminder?.detail) {
      const {
        date,
        time,
        repeat,
        earlyReminder,
        isFlagged,
        priority,
        images,
        addressDetail,
        location,
      } = formReminder.detail;
      return {
        date: date
          ? dayjs(date).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD'),
        time: time ? new Date(time) : getRoundedTime(),
        isToggleDate: !!date,
        isToggleTime: !!time,
        repeat: repeat || REPEAT.NOTHING,
        earlyReminder: earlyReminder || EARLY_REMINDER.NOTHING,
        isFlagged: !!isFlagged,
        priority: priority ? priority : PRIORITY.NOTHING,
        images: images ? images : [],
        isToggleLocation: !!addressDetail,
        location: location,
        addressDetail: addressDetail,
      };
    } else if (!isModeUpdate && !formReminder?.detail) {
      return defaultDetailReminderForm;
    } else {
      if (!reminderUpdated?.detail) return defaultDetailReminderForm;
      const {
        date,
        time,
        earlyReminder,
        repeat,
        isFlagged,
        priority,
        images,
        addressDetail,
        location,
      } = reminderUpdated.detail;

      return {
        date: date
          ? dayjs(date).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD'),
        time: time ? new Date(time) : getRoundedTime(),
        isToggleDate: !!date,
        isToggleTime: !!time,
        earlyReminder: earlyReminder || EARLY_REMINDER.NOTHING,
        repeat: repeat || REPEAT.NOTHING,
        isFlagged: !!isFlagged,
        priority: priority || PRIORITY.NOTHING,
        images: images ? images : [],
        isToggleLocation: !!addressDetail,
        location: location,
        addressDetail: addressDetail,
      };
    }
  };

  //state
  const [detailReminderForm, setDetailReminderForm] =
    useState<IDetailReminderForm>(initDetailReminderForm());
  
  //ref
  const originalDetailReminderForm = useRef<IDetailReminderForm>(detailReminderForm);

  //memo
  const listReminder = useMemo(() => {
    return lists.find(list => list.id === reminderUpdated?.listId)
  },[reminderUpdated?.listId])
  const isDirtyDetailForm = useMemo(() => {
    return JSON.stringify(detailReminderForm) !== JSON.stringify(originalDetailReminderForm.current)
  },[
    originalDetailReminderForm.current,
    detailReminderForm
  ])
  const isDirtyFieldEarlyReminder = useMemo(() => {
    return detailReminderForm.earlyReminder !== 
    originalDetailReminderForm.current?.earlyReminder
  },[
    detailReminderForm.earlyReminder
  ])
  const isDirtyFieldRepeat = useMemo(() => {
    return detailReminderForm.repeat !== 
    originalDetailReminderForm.current?.repeat
  },[
    detailReminderForm.repeat
  ])
  const isDirtyFieldDate = useMemo(() => {
    return dayjs(detailReminderForm.date).toISOString() !== 
      dayjs(originalDetailReminderForm.current?.date).toISOString()
  },[
    detailReminderForm.date
  ])
  const isDirtyFieldTime = useMemo(() => {
    return dayjs(detailReminderForm.time).toISOString() !== 
      dayjs(originalDetailReminderForm.current?.time).toISOString()
  },[
    detailReminderForm.time
  ])

  //life cycle
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: isModeUpdate
        ? () => (
            <Button
              title="Done"
              type="clear"
              buttonStyle={{ marginRight: 8 }}
              onPress={handleConfirmSaveDetailReminder}
            />
          )
        : undefined,
      headerLeft: !isModeUpdate
        ? () => (
            <Button
              title="New reminder"
              type="clear"
              titleStyle={{
                fontSize: 14,
              }}
              icon={<Icon name="arrow-back" color="#007AFF" />}
              onPress={handleConfirmSaveDetailReminder}
            />
          )
        : () => (
            <Button
              title="Cancel"
              type="clear"
              buttonStyle={{ marginLeft: 8 }}
              onPress={handleCloseDetailReminderScreen}
            />
          ),
    });
  }, [navigation, detailReminderForm]);

  //func
  const handleChangeDetailReminderForm = useCallback(
    <K extends keyof IDetailReminderForm>(
      key: K,
      value: IDetailReminderForm[K],
    ) => {
      setDetailReminderForm(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleNavigateListsScreen = () => {
    if(!listReminder) return;
    navigation.navigate('ListReminderOverview', {
      list: listReminder,
      reminderId: route.params.reminderId
    });
  }

  const handleCloseDetailReminderScreen = () => {
    if(!handleCloseBottomSheet) return;
    if(!isDirtyDetailForm) {
      handleCloseBottomSheet()
      return;
    } 
    Alert.alert(
      'Confirm cancel',
      'Change you made may not be saved.',
      [
        {
          text: 'Stay', 
          onPress: () => {},
        },
        {
          text: 'Leave',
          onPress: handleCloseBottomSheet
        },
      ]
    )
  }

  const handleConfirmSaveDetailReminder = async () => {
    const dateTimeSet = 
      (
        detailReminderForm.time && 
        detailReminderForm.date 
      ) ? combineDateAndTime(
        dayjs(detailReminderForm.date).toISOString(), 
        dayjs(detailReminderForm.time).toISOString()
      ) : null

    const isShowEarlyReminderWarning = !!dateTimeSet && checkShowEarlyReminderWarning(
      new Date(),
      dateTimeSet,
      detailReminderForm.earlyReminder
    )

    if (
      isDirtyFieldEarlyReminder &&
      dateTimeSet &&
      detailReminderForm.earlyReminder !== EARLY_REMINDER.NOTHING &&
      (
        // Case 1
        dayjs(dateTimeSet).isBefore(dayjs()) ||
        // Case 2
        isShowEarlyReminderWarning
      )
    ) {
      Alert.alert(
        'Not early reminder',
        'The early notification will not be sent because that time has already passed.',
        [
          {
            text: 'Cancel', 
            onPress: () => {}
          },
          {
            text: 'OK',
            onPress: async () => await handleSaveDetailReminder(dateTimeSet, true),
          },
        ]
      )
    } else {
      await handleSaveDetailReminder(dateTimeSet);
    }
  }

  const handleSaveDetailReminder = async (dateTimeSet: Date | null, isNotExecutedEarlyReminder = false) => {
    handleCloseBottomSheet 
      ? handleCloseBottomSheet() 
      : navigation.goBack();

    const detail = {
      date: detailReminderForm.isToggleDate
        ? dayjs(detailReminderForm.date).toISOString()
        : null,
      time: detailReminderForm.isToggleTime
        ? dayjs(detailReminderForm.time).toISOString()
        : null,
      earlyReminder: detailReminderForm.earlyReminder,
      repeat: detailReminderForm.repeat,
      isFlagged: detailReminderForm.isFlagged,
      priority: detailReminderForm.priority,
      images: detailReminderForm.images,
      location: detailReminderForm.location
        ? detailReminderForm.location
        : null,
      addressDetail: detailReminderForm.isToggleLocation
        ? detailReminderForm.addressDetail
        : '',
    };

    if (isModeUpdate) {
      await dispatch(
        updateFieldDetailReminder({
          reminderId: route.params.reminderId,
          detail,
        }),
      );
    } else {
      dispatch(
        updateFormReminder({
          formReminder: {
            ...formReminder,
            detail,
          },
        }),
      );
    }

    // check allow early reminder notification or not
    // check allow create notification or not
    if(
      reminderUpdated &&
      dateTimeSet
    ) {
      // create noti gốc theo date + time đã set
      if(
        (
          isDirtyFieldDate ||
          isDirtyFieldTime
        ) && 
        detailReminderForm.isToggleDate &&
        detailReminderForm.isToggleTime
      ) {
        await createReminderNotification({
          ...reminderUpdated,
          detail
        })
      } else if(
        !detailReminderForm.isToggleDate
      ){
        await cancelNotificationReminder(reminderUpdated.id);
      }

      // set early reminder
      if(
        !isNotExecutedEarlyReminder && 
        isDirtyFieldEarlyReminder
      ) {
        // khi set early reminder về lại nothing
        if (
          detailReminderForm.earlyReminder === EARLY_REMINDER.NOTHING
        ) {
          await cancelNotificationReminder(`${reminderUpdated.id}_${NOTIFICATION_TYPE.EARLY}`);
        } else {
          await pushEarlyNotificationReminder({
            ...reminderUpdated, 
            detail
          })
        }
      }

      // set repeat, khi set về lại nothing thì hủy noti
      if(
        isDirtyFieldRepeat
      ) {
        if(detailReminderForm.repeat === REPEAT.NOTHING) {
          await cancelNotificationReminder(`${reminderUpdated.id}_${NOTIFICATION_TYPE.REPEAT}`);
        }
        // case ngày giờ là quá khứ, nhưng lúc này mới đi set repeat
        else if(
          dayjs(dateTimeSet).isBefore(dayjs()) &&
          detailReminderForm.repeat
        ) {
          const customNextTime = getNextRepeatTime(
            dateTimeSet,
            dayjs(),
            detailReminderForm.repeat
          ).toDate();
          await rescheduleReminder(reminderUpdated, true, customNextTime)
        }        
      }
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={[Layout.col, Layout.gap, Layout.paddingLayout]}
      >
        <DetailDateTimePicker
          date={detailReminderForm.date}
          time={detailReminderForm.time}
          isToggleDate={detailReminderForm.isToggleDate}
          isToggleTime={detailReminderForm.isToggleTime}
          onChangeDetailReminderForm={handleChangeDetailReminderForm}
        />
        {detailReminderForm.isToggleDate && (
          <EarlyAndRepeatReminder
            isToggleTime={detailReminderForm.isToggleTime}
            valueEarlyReminder={detailReminderForm.earlyReminder}
            valueRepeat={detailReminderForm.repeat}
            onChangeValueEarlyReminder={value =>
              handleChangeDetailReminderForm('earlyReminder', value)
            }
            onChangeValueRepeat={value =>
              handleChangeDetailReminderForm('repeat', value)
            }
          />
        )}
        <ReminderToggleItem
          iconColor="#FA9703"
          iconName="flag"
          label="Flag"
          value={detailReminderForm.isFlagged}
          onValueChange={value =>
            handleChangeDetailReminderForm('isFlagged', value)
          }
        />
        <DetailLocation
          addressDetail={detailReminderForm.addressDetail}
          isToggleLocation={detailReminderForm.isToggleLocation}
          onChangeDetailReminderForm={handleChangeDetailReminderForm}
        />
        <PopupMenuDetail
          menus={MENU_PRIORITY}
          value={detailReminderForm.priority}
          onChangeValue={value =>
            handleChangeDetailReminderForm('priority', value)
          }
        >
          <ReminderLinkItem
            iconColor="#ff0000"
            iconName="priority-high"
            label="Priority"
            iconEnd="unfold-less"
            value={capitalizeFirstLetter(detailReminderForm.priority)}
          />
        </PopupMenuDetail>
        {isModeUpdate && listReminder?.iconColor && listReminder?.iconName && (
          <TouchableOpacity onPress={handleNavigateListsScreen}>
            <ReminderLinkItem 
              iconColor={listReminder?.iconColor} 
              iconName={listReminder?.iconName} 
              label="List" 
              value={listReminder?.name}
            />
          </TouchableOpacity>
        )}
        <ReminderToggleItem
          iconColor="#03fa9b"
          iconName="chat-bubble"
          label="When Message"
        />
        <Text
          style={{
            color: isDark ? Colors.textGray800 : '#000',
          }}
        >
          Selecting this option will show the reminder notification when
          chatting with a person in Messages
        </Text>
        <ReminderLinkItem iconColor="#636363" iconName="style" label="Tags" />
        <DetailImagesReminder
          images={detailReminderForm.images}
          onChangeDetailReminderForm={handleChangeDetailReminderForm}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
