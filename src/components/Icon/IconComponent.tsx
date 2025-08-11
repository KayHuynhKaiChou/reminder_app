import { useTheme } from '@/hooks';
import React from 'react'
import { View } from 'react-native'
import { Icon } from '@rneui/themed';
import { IIcon } from '@/types';

interface IconComponentProps {
  iconData: IIcon;
  sizeIcon?: number;
  iconColorText?: string;
  isBorder?: boolean
}

export default function IconComponent({
  iconData: {
    iconColor,
    iconName
  },
  sizeIcon = 40,
  iconColorText = "#fff",
  isBorder = true
}: IconComponentProps) {

  const {
    Layout
  } = useTheme();

  return (
    <View style={[
      Layout.rowCenter,
      {
        backgroundColor: iconColor,
        width: sizeIcon,
        height: sizeIcon,
        borderRadius: sizeIcon / 2,
        borderWidth: 1,
        borderColor: isBorder ? iconColorText : 'transparent',
      }
    ]}>
      <Icon 
        name={iconName} 
        size={sizeIcon >= 80 ? sizeIcon - 25 : sizeIcon - 15} 
        color={iconColorText}
      />
    </View>
  )
}
