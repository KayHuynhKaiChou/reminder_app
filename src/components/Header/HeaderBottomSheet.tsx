import { useTheme } from '@/hooks';
import { Button } from '@rneui/themed';
import React from 'react'
import { Text, View } from 'react-native'

interface HeaderBottomSheetProps {
    title: string;
    onClose: () => void
}

export default function HeaderBottomSheet({
    title,
    onClose
}: HeaderBottomSheetProps) {
    const {Layout, Fonts} = useTheme();
    return (
        <View style={[Layout.rowHCenter, Layout.rowVSpaceBetween]}>
            <Button title="Cancel" type="clear" onPress={onClose}/>
            <Text style={[Fonts.textRegular, Fonts.textBold]}>{title}</Text>
            <Button title="Create" type="clear"/>
        </View>
    )
}
