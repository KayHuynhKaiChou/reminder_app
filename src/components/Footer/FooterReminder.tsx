import { useTheme } from '@/hooks'
import { Button, Icon } from '@rneui/themed'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { IList } from '@/types'

interface IFooterReminderProps {
    colorList?: IList['iconColor'];
    onAddNewReminder: () => void
}

export default function FooterReminder({
    colorList = '#0387fa',
    onAddNewReminder
}: IFooterReminderProps) {
    const {Layout} = useTheme()

    return (
        <View 
            style={[
                Layout.rowHCenter, 
                Layout.rowVSpaceBetween,
                {marginBottom: 10}
            ]}
        >
            <Button 
                radius={"sm"} 
                type="clear"
                onPress={onAddNewReminder}
            >
                <Icon name="add-circle" color={colorList}/>
                <Text style={[styles.textBtn, {color: colorList}]}>New reminder</Text>
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    textBtn: {
        marginLeft: 10,
        fontWeight: "bold",
        fontSize: 16
    }
})
