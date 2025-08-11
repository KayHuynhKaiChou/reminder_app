import { IList, IReminder } from "@/types";

export type ReminderState = {
  reminders: IReminder[];
};

// export type ReminderUpdateListsPayload = {
//   payload: {
//     lists: IList[]
//   };
// };

// export type ReminderAddListPayload = {
//   payload: {
//     list: IList
//   };
// };

// export type ReminderRemovePayload = {
//   payload: {
//     listId: IList['id']
//   };
// };

// export type ReminderAddReminderPayload = {
//   payload: {
//     listId: IList['id'],
//     reminder: IReminder
//   };
// };

// export type ReminderByIdRemovePayload = {
//   payload: {
//     listId: IList['id'],
//     reminderId: IReminder['id']
//   };
// }

export type ReminderDetailPayload = {
  reminderId: IReminder['id'],
  detail: IReminder['detail']
};

export type ReminderListPayload = {
  reminderId: IReminder['id'],
  listId: IReminder['listId']
};