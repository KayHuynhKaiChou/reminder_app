import FooterHome from '@/components/Footer/FooterHome'
import HeaderHome from '@/components/Header/HeaderHome'
import MyListsReminder from '@/components/MyListsReminder/MyListsReminder'
import SearchReminders from '@/components/SearchReminders/SearchReminders'
import Summary from '@/components/Summary/Summary'
import dayjs from 'dayjs'
import { useTheme } from '@/hooks'
import { updateValueSummary } from '@/store/home'
import { ReminderState } from '@/store/reminder/reminder.type'
import { useIsFocused } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useDebounce from '@/hooks/useDebounce'

export default function Home() {
    const {Layout} = useTheme()
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    //store
    const reminders = useSelector((state: {reminder: ReminderState}) => state.reminder.reminders)

    //state
    const [searchText, setSearchText] = useState('');
    
    //debounce
    const debouncedSearchText = useDebounce(searchText, 500);
    
    //life cycle
    useEffect(() => {
        if (isFocused) {
            // Today
            const today = dayjs().startOf('day');

            const valueToday = reminders
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
                .length

            dispatch(updateValueSummary({ widgetId: "1", value: valueToday}))
            //All
            dispatch(updateValueSummary({ widgetId: "3", value: reminders.filter(r => !r.completed).length}))
            //completed
            const numberCompleted = reminders.filter((reminder) => reminder.completed).length
            dispatch(updateValueSummary({ widgetId: "6", value: numberCompleted}))
            const numberFlagged = reminders.filter((reminder) => reminder.detail?.isFlagged).length
            dispatch(updateValueSummary({ widgetId: "4", value: numberFlagged}))
        }
    }, [isFocused]);

    // useEffect(() => {
    //     dispatch(getAllLists())
    // }, []);

    // useEffect(() => {
    //     dispatch(getAllreminders())
    // }, [])

    //func
    const handleSearchText = useCallback((text: string) => {
        setSearchText(text);
    },[])

    return (
        <SafeAreaView style={[Layout.fill, { marginBottom: 10 }]}>
            <View style={[Layout.paddingLayout, Layout.fill, Layout.col]}>
                <HeaderHome searchText={searchText} onChangeSearchText={handleSearchText}/>
                {debouncedSearchText 
                    ? <SearchReminders searchText={debouncedSearchText}/> 
                    :  (
                        <View style={Layout.fill}>
                            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                                <Summary/>
                                <MyListsReminder/>
                            </ScrollView>
                        </View>
                    )
                }
            </View>
            {!searchText && <FooterHome/>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    homeContainer: {
        
    }
})
