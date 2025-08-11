import { IList, IReminder, NavigationHomeProp } from '@/types'
import React, { memo, useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import IconComponent from '../Icon/IconComponent';
import { Text } from '@rneui/base';
import { Divider, Icon } from '@rneui/themed';
import { useTheme } from '@/hooks';
import { useSelector } from 'react-redux';
import { HomeState } from '@/store/home';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { removeList } from '@/store/list/list.thunk';
import { removeMultipleReminderByListId } from '@/store/reminder/reminder.thunk';
interface ListReminderItemProps {
    testID: string;
    listReminderData: IList;
    onDrag?: () => void
}

const ListReminderItem = ({
    testID,
    listReminderData,
    onDrag
}: ListReminderItemProps) => {
    //props
    const {
        id,
        name,
        iconName,
        iconColor,
    } = listReminderData
    //hook
    const {
        Layout,
        Colors,
        darkMode: isDark
    } = useTheme();
    const navigation = useNavigation<NavigationHomeProp>();
    const dispatch = useAppDispatch();
    const reminders = useSelector((state: {reminder: {reminders: IReminder[]}}) => state.reminder.reminders)
    const isEdit = useSelector((state: {home: HomeState}) => state.home.isEdit)

    const numberReminderUnCompleted = useMemo(
        () => reminders
            .filter(reminder => !reminder.completed && reminder.listId === id)
            .length
        , [reminders]
    )
    //func
    const handleNavigateListDetail = () => {
        navigation.navigate("Reminders", {listId: id})
    }
    const handleNavigateListInformation = () => {
        navigation.navigate("UpdateListSheet", {listId: id})
    }
    const handleDeleteList = () => {
        dispatch(removeList(id))
        dispatch(removeMultipleReminderByListId(id))
    }
    
    return (
        <TouchableOpacity
            testID={testID}
            style={[
                Layout.rowVSpaceBetween, 
                Layout.rowHCenter,
                styles.reminderItemContainer
            ]}
            onPress={isEdit ? undefined : handleNavigateListDetail}
            onPressIn={isEdit ? onDrag : undefined}
        >
            <View style={[Layout.rowHCenter, Layout.gapSmall]}>
                {isEdit && (
                    <TouchableOpacity onPress={handleDeleteList}>
                        <Icon name="do-not-disturb-on" size={30} color={'#ff0000'}/>
                    </TouchableOpacity>
                )}
                <IconComponent iconData={{iconColor, iconName}} />
                <Text 
                    importantForAccessibility="no"
                    numberOfLines={3} 
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        width: isEdit ? 110 : 200, 
                        color: isDark ? '#fff' : Colors.textGray800
                    }}
                >
                    {name}
                </Text>
            </View>
            {isEdit ? (
                <View style={[Layout.rowHCenter, Layout.gapSmall]}>
                    <TouchableOpacity onPress={handleNavigateListInformation}>
                        <Icon name="info" size={30} color={'#0387fa'}/>
                    </TouchableOpacity>
                    <Divider orientation="vertical" style={styles.dividerVertical}/>
                    <Icon name="menu" size={30} color={'#959595'}/>
                </View>
            ) : (
                <View style={[Layout.rowHCenter, Layout.gapSmall]}>
                    <Text
                        importantForAccessibility="no"
                        style={{
                            color: isDark ? '#fff' : Colors.textGray800
                        }}
                    >
                        {0}
                    </Text>
                    <Icon color={isDark ? '#fff' : Colors.textGray800} name="keyboard-arrow-right" size={20}/>
                </View>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  reminderItemContainer: {
    padding: 10   
  },
  dividerVertical: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: -20
  }
})

export default memo(ListReminderItem)
