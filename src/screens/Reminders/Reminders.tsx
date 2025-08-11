import FooterReminder from "@/components/Footer/FooterReminder";
import ReminderItem from "@/components/ReminderItem/ReminderItem";
import PopupMenuDotThree from "@/components/PopupMenu/PopupMenuDotThree";
import EmptyList from "@/components/EmptyList/EmptyList";
import notifee from '@notifee/react-native';
import useEffectSkipFirstRender from "@/hooks/useEffectSkipRender";
import { useTheme } from "@/hooks";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Divider } from "@rneui/themed";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useSelector } from "react-redux";
import { MainParamsList } from "types/navigation";
import { NavigationHomeProp } from "@/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ReminderState } from "@/store/reminder/reminder.type";
import { ListState } from "@/store/list/list.type";
import { removeList, updateList } from "@/store/list/list.thunk";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { addReminder } from "@/store/reminder/reminder.thunk";
import { Swipeable } from "react-native-gesture-handler";

export default function Reminders() {
    //hook
    const {Layout, Fonts} = useTheme()
    
    //route
    const route = useRoute<RouteProp<MainParamsList, "Reminders">>();
    const listId = route.params.listId
    
    //store
    const dispatch = useAppDispatch()
    const lists = useSelector((state: {list: ListState}) => state.list.lists)
    const reminders = useSelector((state: {reminder: ReminderState}) => state.reminder.reminders)

    //navigate
    const navigation = useNavigation<NavigationHomeProp>();

    //ref
    const flatListRef = useRef<FlatList>(null);
    const openSwipeableRef = useRef<Swipeable | null>(null);
    //state

    //memo
    const listDetail = useMemo(() => lists.find((list) => list.id === listId), [lists, listId])
    const remindersFilterCompleted = useMemo(() => {
        return reminders.filter((reminder) => {
            if (reminder.listId !== listId) return false;
            if (!listDetail?.isShowCompleted && reminder.completed) return false;
            return true;
        });    
    },[listDetail, reminders]) 

    //life cycle
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <PopupMenuDotThree 
                    onShowListInfo={handleNavigateListDetail}
                    onDeleteList={handleDeleteList}
                    onChangeShowCompleted={handleChangeShowCompleted}
                    isShowCompleted={listDetail?.isShowCompleted}
                />
            )
        });
    }, [navigation, listDetail?.isShowCompleted]);

    useEffect(() => {
        notifee.getTriggerNotifications()
            .then((notifications) => {
                console.log('Notifications:', notifications);
            });
    },[])

    useEffectSkipFirstRender(() => {
        openSwipeableRef.current?.close();
    },[remindersFilterCompleted])

    //func
    const handleSwipeOpen = useCallback((ref: Swipeable) => {
        if (openSwipeableRef.current && openSwipeableRef.current !== ref) {
            openSwipeableRef.current.close();
        }
        openSwipeableRef.current = ref;
    }, []);
    const handleChangeShowCompleted = () => {
        if(!listDetail) return
        dispatch(updateList(
            {
                ...listDetail,
                isShowCompleted: !listDetail.isShowCompleted
            }
        ))
    }
    const handleNavigateListDetail = () => {
        navigation.navigate("UpdateListSheet", {listId})
    }

    const handleDeleteList = () => {
        dispatch(removeList(listId))
    }

    const isCreating = useRef(false)
    const handleAddFormReminder = async () => {
        if(isCreating.current) return;
        isCreating.current = true
        await dispatch(addReminder({
            listId,
            content: '',
            title: '',
            detail: null,
            completed: false,
            completedAt: null
        }))
        flatListRef.current?.scrollToIndex({index: remindersFilterCompleted.length - 1, animated: true});
    }

    const handleUnlockCreateReminder = useCallback(() => {
        isCreating.current = false
    },[])

    return (
        <>
            <Text 
                //testID="title-reminders"
                accessibilityLabel="title-reminders"
                style={[
                    Fonts.titleSmall, 
                    Layout.paddingLayout,
                    {
                        color: listDetail?.iconColor ? listDetail?.iconColor : '#000', 
                        marginRight: 10,
                        paddingTop: 0
                    }
                ]}
                numberOfLines={1}
            >
                {listDetail?.name}
            </Text>
            <FlatList
                ref={flatListRef}
                
                initialNumToRender={0}
                maxToRenderPerBatch={4}
                data={remindersFilterCompleted}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ReminderItem
                        listId={listId} 
                        reminderData={item} 
                        autoFocus={!item.title}
                        onHiddenFormCreateReminder={handleUnlockCreateReminder}
                        onSwipeOpen={handleSwipeOpen}
                    />
                )}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                renderScrollComponent={(props) => (
                    <KeyboardAwareScrollView {...props} bottomOffset={Platform.OS === 'ios' ? 0 : 80} contentContainerStyle={{ flexGrow: 1 }}/>
                )}
                ListEmptyComponent={() => (
                    <TouchableWithoutFeedback onPress={handleAddFormReminder}>
                        {/* Phải bọc View style flex: 1 
                        thì EmptyList mới kích hoạt onPress của TouchableWithoutFeedback
                        , bắt buộc phải có thẻ View trực tiếp làm child
                        */}
                        <View style={Layout.fill}>
                            <EmptyList content="You don't have any reminders yet"/>
                        </View>
                    </TouchableWithoutFeedback>
                )}
                ItemSeparatorComponent={() => 
                    remindersFilterCompleted.length > 0
                    ? <Divider style={styles.divider}/>
                    : undefined
                }
            />
            <TouchableWithoutFeedback onPress={handleAddFormReminder}>
                <View style={[Layout.fill]} />
            </TouchableWithoutFeedback>
            <FooterReminder
                colorList={listDetail?.iconColor}
                onAddNewReminder={handleAddFormReminder}
            />
        </>
    )
}

const styles = StyleSheet.create({
    titleMain: {
        marginLeft: 10
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginLeft: 50
    } 
})
