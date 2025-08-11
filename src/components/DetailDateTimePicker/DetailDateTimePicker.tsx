import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import TimePicker from '../TimePicker/TimePicker';
import ReminderToggleItem from '../CardSettingReminder/ReminderToggleItem';
import { useTheme } from '@/hooks';
import 'dayjs/locale/vi';
import { formatTime, getDateLabel } from '@/utils';
import useEffectSkipFirstRender from '@/hooks/useEffectSkipRender';
import { IDetailReminder, IDetailReminderForm, NavigationRemindersProp } from '@/types';

interface IDetailDateTimePickerProps extends Pick<IDetailReminderForm, 'date' | 'time' | 'isToggleDate' | 'isToggleTime'>{
  onChangeDetailReminderForm: (key: keyof IDetailReminderForm, value: IDetailReminderForm[keyof IDetailReminder]) => void
}

//component đc dùng ở 2 case : 1. create reminder, 2. update reminder
export default function DetailDateTimePicker({
  date,
  time,
  isToggleDate,
  isToggleTime,
  onChangeDetailReminderForm
}: IDetailDateTimePickerProps) {
  
  // theme
  const { Layout, Colors, darkMode: isDark } = useTheme();

  // memo 
  const selectedTimeFormat = useMemo(() => {
    return formatTime(time as Date);
  }, [time])

  const selectedDateFormat = useMemo(() => {
    return getDateLabel(date);
  }, [date]);

  //life cycle
  useEffectSkipFirstRender(() => {
    // time open => date open
    if(isToggleTime && !isToggleDate) {
      onChangeDetailReminderForm('isToggleDate', true);
    }
  }, [isToggleTime]);

  useEffectSkipFirstRender(() => {
    // date close => time close
    if(!isToggleDate && isToggleTime) {
      onChangeDetailReminderForm('isToggleTime', false);
    }
  }, [isToggleDate])

  //func
  const handleDateChange = useCallback((day: any) => {
    onChangeDetailReminderForm('date', day.dateString);
  }, []);

  const handleTimeChange = useCallback((time?: Date) => {
    if(time){
      onChangeDetailReminderForm('time', time);
    }
  },[]);

  const handleChangeisToggleTime = useCallback((value: boolean) => {
    onChangeDetailReminderForm('isToggleTime', value);
  }, []);

  const handleChangeisToggleDate = useCallback((value: boolean) => {
    onChangeDetailReminderForm('isToggleDate', value);
  }, []);

  return (
    <View 
      style={[
        Layout.col, 
        Layout.card,
        {
          padding: 0,
          gap: isToggleDate ? 10 : 0,
          backgroundColor: isDark ? Colors.textGray600 : Colors.white
        }, 
      ]}
    >
      {/* Date Section */}
      <View>
        <ReminderToggleItem
          iconColor="#ff0000"
          iconName="calendar-month"
          label="Date"
          divider
          value={isToggleDate}
          valueDate={isToggleDate ? selectedDateFormat : ''}
          onValueChange={handleChangeisToggleDate}
        />
        {isToggleDate && 
          <Calendar
            current={date}
            onDayPress={handleDateChange}
            markedDates={{
              [date]: {
                selected: true,
                selectedColor: '#007AFF',
              },
            }}
            theme={{
              backgroundColor: isDark ? Colors.textGray600 : '#ffffff',
              calendarBackground: isDark ? Colors.textGray600 : '#ffffff',
              textSectionTitleColor: isDark ? '#aaaaaa' : '#222222',
              dayTextColor: isDark ? '#ffffff' : '#2d4150',
              monthTextColor: isDark ? '#ffffff' : '#000000',
              todayTextColor: '#007AFF',
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#ffffff',
              arrowColor: '#007AFF',
              textDisabledColor: isDark ? '#555555' : '#d9e1e8',
            }}
          />
        }
      </View>

      {/* Time Section */}
      <View style={{marginBottom: isToggleTime ? 10 : 0}}>
        <ReminderToggleItem
          iconColor="#0387fa"
          iconName="schedule"
          label="Time"
          value={isToggleTime}
          valueDate={isToggleTime ? selectedTimeFormat : ''}
          onValueChange={handleChangeisToggleTime}
        />
        {isToggleTime && 
          <TimePicker value={time} onChange={handleTimeChange} />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  section: {
    marginVertical: 8,
  },
  todayText: {
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#007AFF',
  }
});
