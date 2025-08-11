import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@/hooks';

interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export default function TimePicker ({ value, onChange }: TimePickerProps) {
  const {Layout, Fonts, Colors, darkMode: isDark} = useTheme()
  //react hooks
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i),[]);
  const minutes = useMemo(() =>Array.from({ length: 12 }, (_, i) => i * 5),[]);
  const valueMinutes = useMemo(() => {
    return !!Number(value.getMinutes()) ? value.getMinutes() : 0
  },[value])
  
  //func
  const handleHourChange = (hour: number) => {
    const newDate = new Date(value);
    newDate.setHours(hour);
    onChange(newDate);
  };

  const handleMinuteChange = (minute: number) => {
    const newDate = new Date(value);
    newDate.setMinutes(minute);
    onChange(newDate);
  };

  return (
    <View style={[Layout.rowHCenter, Layout.gap, Layout.paddingLayout]}>
      <View style={[Layout.fill, Layout.col, Layout.gapSmall]}>
        <Text style={Fonts.textBold}>Giờ</Text>
        <Picker
          selectedValue={value.getHours()}
          style={[
            styles.picker,
            { backgroundColor: isDark ? Colors.textGray400 : '#e6e6e6'}
          ]}
          onValueChange={handleHourChange}
        >
          {hours?.map?.((h) => (
            <Picker.Item key={h} label={String(h).padStart(2, '0')} value={h} />
          ))}
        </Picker>
      </View>

      <View style={[Layout.fill, Layout.col, Layout.gapSmall]}>
        <Text style={Fonts.textBold}>Phút</Text>
        <Picker
          selectedValue={valueMinutes}
          style={[
            styles.picker,
            { backgroundColor: isDark ? Colors.textGray400 : '#e6e6e6'}
          ]}          
          onValueChange={handleMinuteChange}
        >
          {minutes.map((m) => (
            <Picker.Item key={m} label={String(m).padStart(2, '0')} value={m} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 44,
  },
});
