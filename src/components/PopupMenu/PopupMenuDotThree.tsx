import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu';
import { Icon } from '@rneui/themed';
import IconComponent from '../Icon/IconComponent';

interface IPopupMenuProps {
  onShowListInfo: () => void;
  onDeleteList: () => void;
  onChangeShowCompleted: () => void;
  isShowCompleted?: boolean;
}

export default function PopupMenuDotThree({
  onShowListInfo,
  onDeleteList,
  onChangeShowCompleted,
  isShowCompleted,
}: IPopupMenuProps) {

  const {Popover} = renderers

  return (
    <Menu 
      renderer={Popover} 
      rendererProps={{
        placement: 'bottom',
        anchorStyle: {
          display: 'none' 
        },
      }}
    >
      <MenuTrigger style={{marginRight: 10}}>
        <IconComponent sizeIcon={25} iconColorText='#007AFF' iconData={{iconColor: 'transparent', iconName: 'more-horiz'}}/>
      </MenuTrigger>

      <MenuOptions customStyles={{ optionsContainer: styles.menuContainer }}>
        <MenuOption onSelect={onShowListInfo}>
          <View style={styles.menuItem}>
            <Icon name="info" type="feather" size={18} style={styles.icon} />
            <Text style={styles.text}>Show List Info</Text>
          </View>
        </MenuOption>

        <MenuOption onSelect={() => {}} disabled>
          <View style={styles.menuItem}>
            <Icon name="share" type="feather" size={18} style={styles.icon} />
            <Text style={styles.text}>Share List</Text>
          </View>
        </MenuOption>

        <MenuOption onSelect={() => {}} disabled>
          <View style={styles.menuItem}>
            <Icon name="check-circle" type="feather" size={18} style={styles.icon} />
            <Text style={styles.text}>Select Reminders...</Text>
          </View>
        </MenuOption>

        <View style={styles.separator} />

        <MenuOption onSelect={() => {}} disabled>
          <View style={styles.menuItem}>
            <Icon name="sort" type="material" size={18} style={styles.icon} />
            <Text style={styles.text}>Sort By</Text>
          </View>
        </MenuOption>

        <MenuOption onSelect={onChangeShowCompleted}>
          {!isShowCompleted ? (
            <View style={styles.menuItem}>
              <Icon name="eye" type="feather" size={18} style={styles.icon} />
              <Text style={styles.text}>Show Completed</Text>
            </View>
          ) : (
            <View style={styles.menuItem}>
              <Icon name="eye-off" type="feather" size={18} style={styles.icon} />
              <Text style={styles.text}>Hide Completed</Text>
            </View>
          )}
        </MenuOption>

        <View style={styles.separator} />

        <MenuOption onSelect={onDeleteList}>
          <View style={styles.menuItem}>
            <Icon name="delete" type="material" size={18} color={'red'} style={styles.icon} />
            <Text style={[styles.text, { color: 'red' }]}>Delete List</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    borderRadius: 10,
    paddingVertical: 4,
    width: 220,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
});
