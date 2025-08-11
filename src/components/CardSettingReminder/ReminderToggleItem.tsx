import IconComponent from "../Icon/IconComponent";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks";
import { Switch } from "@rneui/themed";

interface ReminderToggleItemProps {
  iconColor: string;
  iconName: string;
  label: string;
  valueDate?: string;
  divider?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

export default function ReminderToggleItem({ 
  iconColor, 
  iconName, 
  label, 
  divider,
  value,
  valueDate,
  onValueChange
}: ReminderToggleItemProps) {
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
          <View>
            <Text 
              style={[
                Fonts.textBold,
                Fonts.textSmall,
                {color: isDark ? Colors.white : '#000'}
              ]}
            >
              {label}
            </Text>
            {valueDate && <Text style={[Fonts.textSmall, styles.dateText]}>{valueDate}</Text>}
          </View>
        </View>
        <Switch value={value} onValueChange={onValueChange} />
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
  },
  dateText: {
    fontSize: 14,
    color: '#007AFF',
  }
});
