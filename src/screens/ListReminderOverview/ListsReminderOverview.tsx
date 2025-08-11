import { Divider, Icon } from '@rneui/themed'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/hooks'
import { FormReminderState, updateFormReminder } from '@/store/formReminder'
import { IList } from '@/types'
import { ListState } from '@/store/list/list.type'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { DetailReminderParamList } from 'types/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import IconComponent from '@/components/Icon/IconComponent'
import { updateFieldListReminder } from '@/store/reminder/reminder.thunk'
import useEffectSkipFirstRender from '@/hooks/useEffectSkipRender'

export default function ListsReminderOverview() {
    //theme
    const {Layout, Fonts, Colors, darkMode: isDark} = useTheme()
    //route
    const route =
        useRoute<RouteProp<DetailReminderParamList, 'ListReminderOverview'>>();
    const {list, reminderId} = route.params || {}
    //navigation
    const navigation = useNavigation();
    //store
    const {lists} = useSelector((state: {list: ListState}) => state.list)
    const {formReminder} = useSelector((state: {formReminder: FormReminderState}) => state.formReminder);
    const dispatch = useAppDispatch();
    //state
    const [selectedList, setSelectedList] = useState<IList>(
        route.params?.list || formReminder.list
    )
    //memo
    const isModeUpdate = useMemo(() => {
        return !!list && !!reminderId
    },[route.params])
    //func
    const handleSetListToReminder = (list: IList) => {
        setSelectedList(list);
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
            // Chặn hành động mặc định
            e.preventDefault();

            if (isModeUpdate) {
                await dispatch(updateFieldListReminder({reminderId, listId: selectedList.id}))
            } else {
                dispatch(updateFormReminder({formReminder: {...formReminder, list: selectedList}}))
            }

            navigation.dispatch(e.data.action);
        });

        return unsubscribe;
    }, [selectedList]);
    
    return (
        <View style={[Layout.colHCenter, Layout.gap, {alignItems: 'stretch'}]}>
            <Text 
                style={[
                    Fonts.textCenter, 
                    Fonts.textBold, 
                    {
                        marginTop: 10,
                        color: isDark ? Colors.white : '#000'
                    }
                ]}
            >
                {`Reminder will be created in "${selectedList?.name}"`}
            </Text>
            <FlatList
                data={lists}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        style={[
                            Layout.rowVSpaceBetween, 
                            Layout.rowHCenter, 
                            Layout.gapSmall, 
                            Layout.paddingLayout
                        ]}
                        onPress={() => handleSetListToReminder(item)}
                    >
                        <View style={[Layout.rowHCenter, Layout.gapSmall]}>
                          <IconComponent iconData={{iconColor: item.iconColor, iconName: item.iconName}}/>
                          <Text
                            style={[
                              Fonts.textBold,
                              Fonts.textSmall,
                              {color: isDark ? Colors.white : '#000'}
                            ]}
                          >
                            {item.name}
                          </Text>
                        </View>
                        {selectedList?.id === item.id && <Icon name='check' color={'#007AFF'}/>}
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <Divider style={styles.divider}/>}
                ListFooterComponent={() => <Divider style={[styles.divider, {backgroundColor: '#d1d3d8'}]}/>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    titleMain: {
        marginLeft: 10
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginLeft: 60
    } 
})
