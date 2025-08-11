import { capitalizeFirstLetter } from '@/utils';
import { Icon } from '@rneui/themed';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu';

interface IPopupMenuProps {
  menus?: string[];
  children: JSX.Element;
  value: string;
  onChangeValue: (value: any) => void;
}

export default function PopupMenuDetail({
  menus = [],
  children,
  value,
  onChangeValue
}: IPopupMenuProps) {

  const {Popover} = renderers

  return (
    <Menu 
      renderer={Popover} 
      rendererProps={{
        preferredPlacement: 'top',
        placement: 'auto',
        anchorStyle: {
          display: 'none' 
        },
      }}
    >
      <MenuTrigger>
        {children}
      </MenuTrigger>
      <MenuOptions 
        customStyles={{ optionsContainer: styles.menuContainer }}
      >
        {menus.map((item, index) => (
          <MenuOption key={index} onSelect={() => onChangeValue(item)}>
            <View style={styles.menuItem}>
              {value === item 
                ? <Icon name='check' />
                : <View style={{width: 25}}/>
              }
              <Text>{capitalizeFirstLetter(item)}</Text>
            </View>
          </MenuOption>
        ))}
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
    gap: 10,
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
