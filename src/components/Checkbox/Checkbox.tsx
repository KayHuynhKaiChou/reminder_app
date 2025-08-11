import { useTheme } from '@/hooks';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onToggle: () => void;
  size?: number;
}

const Checkbox = ({ label, checked, onToggle, size = 30 }: CheckboxProps) => {
  const {Layout} = useTheme()
  return (
    <TouchableOpacity style={Layout.rowHCenter} onPress={onToggle}>
      <Icon
        name={checked ? 'check-circle' : 'radio-button-unchecked'}
        size={size}
        color={checked ? '#4285F4' : '#ccc'}
      />
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginLeft: 8,
  },
});
