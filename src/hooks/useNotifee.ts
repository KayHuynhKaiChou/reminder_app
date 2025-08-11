import { EARLY_REMINDER_OFFSET_MINUTES, REPEAT_OFFSET_MINUTES } from '@/constants';
import { IReminder } from '@/types';
import { EARLY_REMINDER, NOTIFICATION_TYPE, REPEAT } from '@/types/enum';
import { combineDateAndTime } from '@/utils';
import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
} from '@notifee/react-native';

export const useNotifee = () => {    
    async function getOrCreateReminderChannelId() {
        return await notifee.createChannel({
            id: 'reminder',
            name: 'Reminders',
            importance: AndroidImportance.HIGH,
        });
    }

    // hàm này chỉ dùng khi lần đầu mới set date + time 
    // hoặc update date + time
    async function createReminderNotification(reminder: IReminder) {
        if(!reminder.detail?.date || !reminder.detail?.time) return

        let triggerDate = combineDateAndTime(reminder.detail?.date, reminder.detail?.time)

        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: triggerDate.getTime(),
            alarmManager: true,
        };

        try {
            const channelId = await getOrCreateReminderChannelId();
            
            await notifee.createTriggerNotification(
                {
                    id: reminder.id,
                    title: reminder.title,
                    subtitle: 'Now',
                    body: reminder.content,
                    android: {
                        channelId,
                        pressAction: { id: 'default' },
                        showTimestamp: true,
                        smallIcon: 'splash_icon'
                    },
                    data: { 
                        listId: reminder.listId,
                        reminderId: reminder.id,
                        isRepeated: JSON.stringify(true)
                    }
                },
                trigger,
            );
        } catch (error) {
            console.error(error)
        }
    }

    // hàm này chỉ dùng khi update repeat
    async function rescheduleReminder(reminder: IReminder, isRepeated: boolean, customNextTime?: Date) {               
        const repeat = reminder?.detail?.repeat || REPEAT.NOTHING;
        if (!reminder || repeat === REPEAT.NOTHING) return;
        
        const delayMs = REPEAT_OFFSET_MINUTES[repeat] * 60 * 1000;

        const nextTime = new Date(Date.now() + delayMs);
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: customNextTime ? customNextTime.getTime() : nextTime.getTime(),
            alarmManager: true,
            // repeatFrequency: undefined
        };

        try {
            const channelId = await getOrCreateReminderChannelId();
    
            await notifee.createTriggerNotification(
                {
                    id: `${reminder.id}_${NOTIFICATION_TYPE.REPEAT}`,
                    title: reminder.title,
                    subtitle: 'Repeat',
                    body: reminder.content,
                    android: {
                        channelId,
                        pressAction: { id: 'default' },
                        showTimestamp: true,
                    },
                    data: {
                        listId: reminder.listId,
                        reminderId: reminder.id,
                        isRepeated: JSON.stringify(isRepeated)
                    },
                },
                trigger
            );
        } catch (error) {
            console.error('Error reschedule', error);
        }

    }

    // hàm này chỉ dùng khi update early reminder
    async function pushEarlyNotificationReminder(reminder: IReminder) {        
        const earlyReminder = reminder.detail?.earlyReminder || EARLY_REMINDER.NOTHING;
        
        if(
            !reminder.detail?.date || !reminder.detail?.time
        ) return;

        // if(
        //     earlyReminder === EARLY_REMINDER.NOTHING
        // ) {
        //     cancelNotificationReminder(reminder.id + 'early');
        //     return;
        // }
        
        const triggerDate = combineDateAndTime(reminder.detail?.date, reminder.detail?.time)
        
        const delayMs = EARLY_REMINDER_OFFSET_MINUTES[earlyReminder] * 60 * 1000;
        
        const previousTime = new Date(triggerDate.getTime() - delayMs);
        
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: previousTime.getTime(),
            alarmManager: true,
            // repeatFrequency: undefined
        };

        try {
            const channelId = await getOrCreateReminderChannelId();
    
            await notifee.createTriggerNotification(
                {
                    id: `${reminder.id}_${NOTIFICATION_TYPE.EARLY}`,
                    title: reminder.title,
                    subtitle: 'Early',
                    body: reminder.content,
                    android: {
                        channelId,
                        pressAction: { id: 'default' },
                        showTimestamp: true,
                    },
                    data: {
                        listId: reminder.listId,
                        reminderId: reminder.id,
                        isRepeated: JSON.stringify(false)
                        // lời nhắc sớm chốt là chỉ show 1 lần duy nhất => ko có repeat
                        // chỉ repeat cho mốc thời gian gốc của reminder
                    },
                },
                trigger
            );
        } catch (error) {
            console.log(error);
        }

    }

    async function getTriggerNotificationIds() {
        const ids = await notifee.getTriggerNotificationIds()
        return ids
    }

    async function cancelNotificationReminder(notificationId: string) {
        try {
            await notifee.cancelNotification(notificationId);
        } catch (error) {
            console.log(error);
        }
    }

    return {
        getTriggerNotificationIds,
        createReminderNotification,
        rescheduleReminder,
        pushEarlyNotificationReminder,
        cancelNotificationReminder
    };
}

