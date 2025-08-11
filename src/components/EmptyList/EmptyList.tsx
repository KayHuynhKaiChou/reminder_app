import { useTheme } from "@/hooks";
import { Text, View } from "react-native";

interface IEmptyListProps {
    content: string;
    subContent?: string;
}

export default function EmptyList({content, subContent}: IEmptyListProps) {
    const {Layout, darkMode: isDark} = useTheme()
    
    return (
        <View 
            style={[
                Layout.colHCenter, 
                Layout.colVCenter,
                Layout.fill
            ]}
        >
            <Text
                style={{
                    color: isDark ? '#fff' : '#000'
                }}
            >
                {content}
            </Text>
            {subContent && <Text
                style={{
                    color: isDark ? '#fff' : '#000'
                }}
            >
                {subContent}
            </Text>}
        </View>
    )
}
