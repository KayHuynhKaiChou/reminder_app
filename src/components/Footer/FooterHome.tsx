import { useTheme } from '@/hooks'
import { HomeState } from '@/store/home'
import { Button, Icon } from '@rneui/themed'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { NavigationHomeProp } from '@/types'
import { ListState } from '@/store/list/list.type'
import { useMemo } from 'react'

export default function FooterHome() {
    const {Layout} = useTheme()
    //store
    const lists = useSelector((state: {list: ListState}) => state.list.lists)
    const isEdit = useSelector((state: {home: HomeState}) => state.home.isEdit)

    //navigate
    const navigation = useNavigation<NavigationHomeProp>();

    //memo
    const isDisabledBtn = useMemo(() => {
        return lists.length === 0
    },[lists.length])

    //func
    const handleNavigateNewReminder = () => {
        navigation.navigate("NewReminderSheet")
    }

    const handleNavigateAddList = () => {
        navigation.navigate("AddListSheet")
    }

    return (
        <View style={[Layout.rowHCenter, Layout.rowVSpaceBetween]}>
            {isEdit ? (
                <Button 
                    title="Add group" 
                    type="clear"
                />
            ) : (
                <Button 
                    radius={"sm"} 
                    type="clear"
                    disabled={isDisabledBtn}
                    onPress={handleNavigateNewReminder}
                >
                    <Icon name="add-circle" color={"#0387fa"}/>
                    <Text style={styles.textBtn}>New reminder</Text>
                </Button>
            )}
            <Button 
                title="Add list" 
                type="clear"
                onPress={handleNavigateAddList}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    textBtn: {
        marginLeft: 10,
        color: "#0387fa",
        fontWeight: "bold",
        fontSize: 16
    }
})
