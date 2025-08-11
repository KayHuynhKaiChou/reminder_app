import { StackNavigationProp } from "@react-navigation/stack";
import { DetailReminderParamList, MainParamsList, ReminderParamList } from "types/navigation";
import { EARLY_REMINDER, PRIORITY, REPEAT } from "./enum";

export type NavigationHomeProp = StackNavigationProp<MainParamsList, 'Home'>;

export type NavigationNewReminderProp = StackNavigationProp<ReminderParamList, 'NewReminder'>;

export type NavigationDetailReminderProp = StackNavigationProp<DetailReminderParamList, 'DetailsReminder'>;

export type NavigationRemindersProp = StackNavigationProp<MainParamsList, 'Reminders'>;

export interface IEntity {id: string}

export interface IOption {
    label: string;
    value: string;
}

export interface IIcon {
    iconName: string;
    iconColor: string;  
}
export interface IWidgetSummary extends IIcon, IEntity {
    name: string;
    value: number;
    checked: boolean;
}

export interface IList extends IIcon, IEntity {
    name: string;
    isShowCompleted?: boolean;
}

export interface IImage extends IEntity {
    url: string;
} 

export interface IDetailReminder {
    date?: string | null;
    time?: string | null;
    earlyReminder?: EARLY_REMINDER;
    repeat?: REPEAT;
    isFlagged?: boolean;
    priority?: PRIORITY;
    images?: IImage[];
    location?: {
        latitude: number;
        longitude: number;
    } | null;
    addressDetail?: string;
}

export interface IReminder extends IEntity{
    title: string;
    content: string;
    detail?: IDetailReminder | null
    completed: boolean;
    completedAt: string | null;
    listId: IList['id'];
}

export interface IFormReminder extends Pick<
    IReminder, 'title' | 'content'
> {
    list?: IList;
    detail?: IReminder['detail'];
}

export interface IDetailReminderForm {
    date: string;
    time: Date;
    isToggleDate: boolean;
    isToggleTime: boolean;
    earlyReminder: EARLY_REMINDER;
    repeat: REPEAT;
    isFlagged: boolean;
    priority: PRIORITY;
    images: IImage[];
    location?: {
        latitude: number;
        longitude: number;
    } | null;
    addressDetail?: string;
    isToggleLocation: boolean;
}