import { useTheme } from '@/hooks';
import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import ReminderLinkItem from '../CardSettingReminder/ReminderLinkItem';
import { MENU_EARLY_REMINDER, MENU_REPEAT } from '@/constants';
import PopupMenuDetail from '../PopupMenu/PopupMenuDetail';
import { EARLY_REMINDER, REPEAT } from '@/types/enum';
import { capitalizeFirstLetter } from '@/utils';

interface IEarlyAndRepeatReminderProps {
  isToggleTime: boolean;
  valueEarlyReminder: EARLY_REMINDER;
  valueRepeat: REPEAT;
  onChangeValueEarlyReminder: (value: any) => void;
  onChangeValueRepeat: (value: any) => void;
}

const EarlyAndRepeatReminder = ({
  isToggleTime,
  valueEarlyReminder,
  valueRepeat,
  onChangeValueEarlyReminder,
  onChangeValueRepeat,
}: IEarlyAndRepeatReminderProps) => {
    // theme
    const { Layout, Colors, darkMode: isDark } = useTheme();

    //memo
    const menuEarlyReminderFilter = useMemo(() => {
        return isToggleTime
        ? MENU_EARLY_REMINDER
        : MENU_EARLY_REMINDER.filter(
            item =>
                ![
                    EARLY_REMINDER.BEFORE_FIVE_MINUTES,
                    EARLY_REMINDER.BEFORE_FIFTEEN_MINUTES,
                    EARLY_REMINDER.BEFORE_THIRTY_MINUTES,
                    EARLY_REMINDER.BEFORE_ONE_HOUR
                ].includes(item),
            );
    }, [isToggleTime]);
    
    const menuRepeatFilter = useMemo(() => {
        return isToggleTime
        ? MENU_REPEAT
        : MENU_REPEAT.filter(
            item =>
                ![
                    REPEAT.FIVE_MINUTES,
                    REPEAT.THIRTY_MINUTES,
                    REPEAT.ONE_HOUR
                ].includes(item),
            );
    }, [isToggleTime]);

    return (
        <View
            style={[
                Layout.col,
                Layout.card,
                {
                    padding: 0,
                    backgroundColor: isDark ? Colors.textGray600 : Colors.white,
                },
            ]}
        >
            <PopupMenuDetail
                menus={menuEarlyReminderFilter}
                value={valueEarlyReminder}
                onChangeValue={onChangeValueEarlyReminder}
            >
                <ReminderLinkItem
                    iconColor="#ea00ff"
                    iconName="notifications"
                    iconEnd="unfold-less"
                    label="Early reminder"
                    value={capitalizeFirstLetter(valueEarlyReminder)}
                    divider
                />
            </PopupMenuDetail>
            <PopupMenuDetail
                menus={menuRepeatFilter}
                value={valueRepeat}
                onChangeValue={onChangeValueRepeat}
            >
                <ReminderLinkItem
                    iconColor="gray"
                    iconName="repeat"
                    label="Repeat"
                    value={capitalizeFirstLetter(valueRepeat)}
                />
            </PopupMenuDetail>
        </View>
    );
};

export default memo(EarlyAndRepeatReminder);
