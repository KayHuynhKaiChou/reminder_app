import { createAsyncThunk } from '@reduxjs/toolkit';
import firestore from "@react-native-firebase/firestore";
import { IList, IReminder } from '@/types';
import { ReminderDetailPayload, ReminderListPayload } from './reminder.type';

const db = firestore();

//reminder collection
export const getAllreminders = createAsyncThunk<IReminder[]>(
  'reminder/getAllreminders',
  async () => {
    const remindersSnap = await db.collection('reminders').get()

    const reminders = remindersSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as IReminder[]

    return reminders;
  }
);

export const addReminder = createAsyncThunk<IReminder, Omit<IReminder , 'id'>>(
  'reminder/addReminder',
  async (newReminder) => {
    const docRef =await db.collection("reminders").add(newReminder);
    return { id: docRef.id, ...newReminder };  
  } 
);

export const updateReminder = createAsyncThunk<IReminder, IReminder>(
  'reminder/updateReminder',
  async (updateReminder) => {
    const { id, ...data } = updateReminder;
    await db.collection("reminders").doc(id).update(data);
    return updateReminder;
  } 
);

export const removeReminder = createAsyncThunk<IReminder['id'], IReminder['id']>(
  'reminder/removeReminder',
  async (reminderId) => {
    await db.collection("reminders").doc(reminderId).delete();
    return reminderId;  
  } 
);

export const removeMultipleReminderByListId = createAsyncThunk<IReminder['id'], IList['id']>(
  'reminder/removeMultipleReminderByListId',
  async (listId) => {
    //Xóa tất cả reminders có listId = listId
    const remindersSnapshot = await db
      .collection('reminders')
      .where('listId', '==', listId)
      .get();

    const batch = db.batch();

    remindersSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return listId;  
  } 
);

// export const removeLastReminderFromList = createAsyncThunk<IList['id'], IList['id']>(
//   'reminder/removeLastReminderFromList',
//   async (reminderId) => {
//     await db.collection("reminders").doc(reminderId).delete();
//     return reminderId;  
//   } 
// );

export const updateFieldDetailReminder = createAsyncThunk<ReminderDetailPayload, ReminderDetailPayload>(
  'reminder/updateFieldDetailReminder',
  async ({ reminderId, detail }) => {
    await db.collection("reminders").doc(reminderId).update({detail});
    return { reminderId, detail } 
  } 
);

export const updateFieldListReminder = createAsyncThunk<ReminderListPayload, ReminderListPayload>(
  'reminder/updateFieldListReminder',
  async ({ reminderId, listId }) => {
    await db.collection("reminders").doc(reminderId).update({listId});
    return { reminderId, listId } 
  } 
);
