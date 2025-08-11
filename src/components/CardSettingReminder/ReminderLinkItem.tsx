import { View, Text, StyleSheet, Pressable } from "react-native";
import { Icon } from "@rneui/themed";
import IconComponent from "../Icon/IconComponent";
import { useTheme } from "@/hooks";

interface IReminderLinkItemProps {
  iconColor: string;
  iconName: string;
  label: string;
  iconEnd?: string;
  value?: string;
  divider?: boolean;
}

export default function ReminderLinkItem({ 
  iconColor, 
  iconName, 
  label,
  iconEnd = 'keyboard-arrow-right',
  value,
  divider
}: IReminderLinkItemProps) {
  const { Layout, Fonts, Colors, darkMode: isDark } = useTheme();

  return (
    <View>
      <View 
        style={[
          Layout.rowVSpaceBetween, 
          Layout.rowHCenter, 
          Layout.card,
          {backgroundColor: isDark ? Colors.textGray600 : '#fff'}
        ]}
      >
        <View style={[Layout.rowHCenter, Layout.gapSmall]}>
          <IconComponent iconData={{ iconColor, iconName }} />
          <Text 
            style={[
              Fonts.textBold,
              Fonts.textSmall,
              {
                color: isDark ? Colors.white : '#000', 
                width: 80
              }
            ]}
          >
            {label}
          </Text>
        </View>
        <View style={[Layout.rowHCenter, Layout.gapSmall]}>
          {value && (
            <Text
              style={{
                color: isDark ? Colors.textGray800 : '#000',
                textAlign: "right",
                width: 100
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {value}
            </Text>
          )}
          <Icon name={iconEnd} size={30} color="#959595" />
        </View>
      </View>
      {divider && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 60,
  }
});
