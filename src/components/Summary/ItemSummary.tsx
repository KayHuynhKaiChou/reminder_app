import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Checkbox from '../Checkbox/Checkbox'
import { IWidgetSummary } from '@/types'
import IconComponent from '../Icon/IconComponent'
import { Icon } from '@rneui/themed'
import { useTheme } from '@/hooks'
import { useDispatch } from 'react-redux'
import { updateCheckedSummary } from '@/store/home'
import { memo } from 'react'

interface IItemSummaryProps {
  widgetData: IWidgetSummary
  onPressIn: () => void
  isActive: boolean;
}

const ItemSummary = ({
  widgetData: {
    id,
    name,
    iconColor,
    iconName,
    checked
  },
  onPressIn
}: IItemSummaryProps) => {
  const {Layout, Fonts, Colors, darkMode: isDark} = useTheme()
  const dispatch = useDispatch();
  //func
  const handleCheckedSummary = () => {
    dispatch(updateCheckedSummary({ widgetId: id, checked: !checked }))
  }
  return (
    <>
      {console.log(name)}
      <TouchableOpacity 
        onPressIn={onPressIn}
        style={[
          { backgroundColor: isDark ? Colors.textGray600 :'#fff' },
          Layout.rowVSpaceBetween,
          Layout.rowHCenter,
          styles.itemSummaryContainer
        ]}
      >
        <View style={[Layout.rowHCenter, Layout.gapSmall]}>
          <Checkbox checked={checked} onToggle={handleCheckedSummary}/>
          <IconComponent iconData={{iconColor, iconName}} /> 
          <Text 
            style={[
              Fonts.textBold, 
              Fonts.textSmall, 
              styles.nameList,
              {color: isDark ? Colors.white : '#000'}
            ]}
          >
            {name}
          </Text>
        </View>
        <View>
          <Icon name="menu" size={30} color={'#959595'}/>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default memo(ItemSummary)

const styles = StyleSheet.create({
  itemSummaryContainer: {
    borderRadius: 10,
    padding: 10
  },
  nameList: {
    color: '#fff'
  }
});
