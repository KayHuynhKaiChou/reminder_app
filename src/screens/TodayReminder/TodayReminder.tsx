import EmptyList from "@/components/EmptyList/EmptyList";
import ReminderItem from "@/components/ReminderItem/ReminderItem";
import { useTheme } from "@/hooks";
import useEffectSkipFirstRender from "@/hooks/useEffectSkipRender";
import { ListState } from "@/store/list/list.type";
import { ReminderState } from "@/store/reminder/reminder.type";
import { Divider } from "@rneui/themed";
import dayjs from "dayjs";
import { useCallback, useMemo, useRef } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

export default function TodayReminder() {
    const {Layout, Fonts, darkMode: isDark} = useTheme()
    //store
    const reminders = useSelector((state: {reminder: ReminderState}) => state.reminder.reminders)
    const lists = useSelector((state: {list: ListState}) => state.list.lists)
    
    //ref
    const openSwipeableRef = useRef<Swipeable | null>(null);

    //memo
    const listsMap = useMemo(() => {
        return new Map(lists.map(
            list => [
                list.id, 
                {
                    name: list.name, 
                    iconColor: list.iconColor
                }
            ]
        ));    
    },[lists])  
    const todayReminders = useMemo(() => {
        const today = dayjs().startOf('day');
        return reminders
            .filter(
                (reminder) => {
                    return (
                        !reminder.completed &&
                        reminder.detail?.date &&
                        (
                            dayjs(reminder.detail.date).isSame(today, 'day') ||
                            dayjs(reminder.detail.date).isBefore(today, 'day')
                        )
                    )
                }
            )
    }, [lists]);

    useEffectSkipFirstRender(() => {
        openSwipeableRef.current?.close();
    },[todayReminders])

    //func
    const handleSwipeOpen = useCallback((ref: Swipeable) => {
        if (openSwipeableRef.current && openSwipeableRef.current !== ref) {
            openSwipeableRef.current.close();
        }
        openSwipeableRef.current = ref;
    }, []);
    
    return (
        <SafeAreaView style={[Layout.paddingLayout, Layout.fill]}>
            <FlatList
                initialNumToRender={2}
                maxToRenderPerBatch={6}
                data={todayReminders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ReminderItem
                        listId={item.listId} 
                        listName={listsMap.get(item.listId)?.name}
                        reminderData={item}
                        colorList={listsMap.get(item.listId)?.iconColor}
                        onSwipeOpen={handleSwipeOpen}
                        autoFocus={!item.title}
                    />
                )}
                contentContainerStyle={{flexGrow: 1}}
                ItemSeparatorComponent={() => <Divider style={styles.divider}/>}
                ListHeaderComponent={() => (
                    <Text
                        style={[
                            Fonts.titleSmall, 
                            {
                                marginLeft: 10
                            },
                        ]}
                    >
                        Today
                    </Text>
                )}
                ListFooterComponent={
                    todayReminders.length === 0 
                        ? undefined
                        : () => (
                            <Divider style={[styles.divider]}/>
                          )
                }
                ListEmptyComponent={() => (
                    <EmptyList content="No reminders completted" />
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    titleMain: {
        marginLeft: 10
    },
    divider: {
        height: 1,
        backgroundColor: '#d1d3d8',
        marginLeft: 50
    } 
})
