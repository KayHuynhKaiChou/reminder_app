import { useTheme } from '@/hooks'
import { Button, Divider } from '@rneui/themed'
import React, { useMemo, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import ReminderItem from '../ReminderItem/ReminderItem'
import { ReminderState } from '@/store/reminder/reminder.type'
import { ListState } from '@/store/list/list.type'
import EmptyList from '../EmptyList/EmptyList'

interface ISearchRemindersProps {
    searchText: string
}

export default function SearchReminders({
    searchText
}: ISearchRemindersProps) {
    const {Layout, darkMode: isDark} = useTheme();
    //store
    const {reminders} = useSelector((state: {reminder: ReminderState}) => state.reminder);
    const {lists} = useSelector((state: {list: ListState}) => state.list);
    //state
    const [isShowCompleted, setIsShowCompleted] = useState(false);
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
    }, [lists]);
    const remindersFiltered = useMemo(() => {
        return reminders
            .filter((reminder) => {
                const listName = listsMap.get(reminder.listId)?.name || '';
                return (
                    reminder.title.toLowerCase().includes(searchText.toLowerCase()) || 
                    reminder.content.toLowerCase().includes(searchText.toLowerCase()) ||
                    listName.toLowerCase().includes(searchText.toLowerCase())
                )
            })
            .map(
                (reminder) => {
                    const list = listsMap.get(reminder.listId);
                    return {
                        ...reminder,
                        list: {
                            id: reminder.listId,
                            name: list?.name || '',
                            iconColor: list?.iconColor || ''
                        }
                    }
                }
            )
    }, [searchText, lists, isShowCompleted, reminders]);
    const remindersCheckCompleted = useMemo(() => {
        if(isShowCompleted) return remindersFiltered
        return remindersFiltered
            .filter((reminder) => !reminder.completed)
    }, [remindersFiltered])
    const numberRemindersCompleted = useMemo(() => {
        return remindersFiltered
            .filter((reminder) => reminder.completed).length
    },[lists, remindersFiltered])

    return (
        <FlatList
            data={remindersCheckCompleted}
            renderItem={({ item }) => (
                <ReminderItem
                    listId={item.list.id} 
                    listName={item.list.name}
                    reminderData={item}
                    colorList={item.list.iconColor}
                    autoFocus={!item.title}
                />
            )}
            contentContainerStyle={{ flexGrow: 1}}
            ItemSeparatorComponent={() => <Divider style={styles.divider}/>}
            ListHeaderComponent={() => (
                <View style={[Layout.rowVSpaceBetween, Layout.rowHCenter]}>
                    <Text
                        style={{
                            color: isDark ? '#fff' : '#000'
                        }}
                    >
                        {`Has completed ${numberRemindersCompleted} reminders`}
                    </Text>
                    <Button 
                        title={isShowCompleted ? 'Hide' : 'Show'} 
                        type="clear" 
                        disabled={numberRemindersCompleted === 0}
                        onPress={() => setIsShowCompleted(!isShowCompleted)}
                    />
                </View>
            )}
            ListFooterComponent={
                remindersFiltered.length === 0 
                    ? undefined
                    : () => (
                        <Divider style={[styles.divider]}/>
                      )
            }
            ListEmptyComponent={() => (
                <EmptyList content="No reminders found" />
            )}
        />
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
