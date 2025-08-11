import { useTheme } from '@/hooks';
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IWidgetSummary, NavigationHomeProp } from '@/types';
import IconComponent from '../Icon/IconComponent';
import { useNavigation } from '@react-navigation/native';
interface WidgetSummaryProps {
  widgetData: IWidgetSummary
}

export default function WidgetSummary({
  widgetData: {
    id,
    name,
    value,
    iconName,
    iconColor
  }
}: WidgetSummaryProps) {
  const screenWidth = Dimensions.get('window').width;

  const {
    Layout,
    Fonts,
    Colors,
    darkMode: isDark,
  } = useTheme();

  const navigation = useNavigation<NavigationHomeProp>();

  //func
  const handleNavigateScreen = () => {
    let nameScreen = 'TodayReminder'
    switch (id) {
      case "1":
        nameScreen = 'TodayReminder'
        break;
      case "3":
        nameScreen = 'AllReminder'
        break;
      case "4":
        nameScreen = 'FlaggedReminder'
        break;
      case "6":
        nameScreen = 'CompletedReminder'
        break;
      default:
        break;
    } 
    navigation.navigate(nameScreen as any)
  }

  return (
    <TouchableOpacity 
      style={[
        Layout.col,
        Layout.gapSmall,
        Layout.card,
        {
          backgroundColor: isDark ? Colors.textGray600 : Layout.card.backgroundColor,
          width: (screenWidth / 2) - Layout.gap.gap
        }
      ]}
      onPress={handleNavigateScreen}
    >
      <View style={[
        Layout.rowVSpaceBetween, 
        Layout.rowHCenter,
        Layout.relative
      ]}>
        <IconComponent iconData={{iconColor, iconName}} />
        <Text 
          style={[
            Fonts.titleSmall, 
            styles.value,
            { color: isDark ? '#fff' : '#000' }, 
          ]}
        >
          {value}
        </Text>
        {id === "1" && (
          <View style={[
            Layout.absolute,
            {top: 14, left: 13}
          ]}>
            <Text style={[styles.today]}>
              {new Date().getDate().toString().padStart(2, '0')}
            </Text>
          </View>
        )}
      </View>
      <View>
        <Text style={[Fonts.textSmall, Fonts.textBold]}>{name}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  value: {
    fontSize: 30,
  },
  today: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  }
})
