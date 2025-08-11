import { useTheme } from '@/hooks';
import { BottomSheet, Button } from '@rneui/themed';
import { Text, View } from 'react-native';
import { Layout } from 'react-native-reanimated';

interface NewGroupProps {
    isVisible: boolean;
}

export default function NewGroup({
    isVisible,
}: NewGroupProps) {
    const {Layout} = useTheme();
  return (
    <BottomSheet modalProps={{}} isVisible={isVisible}>
        <View style={[Layout.rowHCenter, Layout.rowVSpaceBetween]}>
            <Button title="Cancel" type="clear"/>
            <Text>New group</Text>
            <Button title="Create" type="clear"/>
        </View>
    </BottomSheet>
  )
}
