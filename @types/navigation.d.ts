import { IList, IReminder } from '@/types';
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type MainParamsList = {
  Home: undefined;
  Reminders: {listId: IList['id']};
  NewReminderSheet: undefined;
  AddListSheet: undefined;
  UpdateListSheet: {listId: IList['id']};
  CompletedReminder: undefined;
  TodayReminder: undefined;
  AllReminder: undefined;
  FlaggedReminder: undefined;
  DetailsReminderSheet: {reminderId: IReminder['id']};
};

export type ReminderParamList = {
  NewReminder: undefined;
  DetailsReminder: undefined;
  ListReminderOverview: undefined;
};

export type DetailReminderParamList = {
  DetailsReminder: {reminderId: IReminder['id']};
  ListReminderOverview: {list: IList, reminderId: IReminder['id']};
};

export type AddListParamList = {
  AddList: undefined;
};

export type UpdateListParamList = {
  UpdateList: {listId: IList['id']};
};

export type ApplicationStackParamList = {
  Startup: undefined;
  Main: NavigatorScreenParams<MainParamsList>;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;
