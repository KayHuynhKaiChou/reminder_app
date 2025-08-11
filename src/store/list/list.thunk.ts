import { createAsyncThunk } from '@reduxjs/toolkit';
import firestore from "@react-native-firebase/firestore";
import { IList } from '@/types';

const db = firestore();

//list collection
export const getAllLists = createAsyncThunk<IList[]>(
  'list/getAllLists',
  async () => {
    const listsSnap = await db.collection('lists').get()

    const lists = listsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as IList[]

    return lists;
  }
);

export const updateNewLists = createAsyncThunk<IList[], IList[]>(
  'list/updateNewLists',
  async (newLists) => {

    return newLists;
  }
);

export const addList = createAsyncThunk<IList, Omit<IList, 'id'>>(
  'list/addList',
  async (newList) => {
    const docRef = await db.collection("lists").add(newList);
    return { id: docRef.id, ...newList };    
  }
);

export const updateList = createAsyncThunk<IList, IList>(
  'list/updateList',
  async (updatedList) => {
    const { id, ...data } = updatedList;
    await db.collection("lists").doc(id).update(data);
    return updatedList;  
  }
);

export const removeList = createAsyncThunk<IList['id'], IList['id']>(
  'list/removeList',
  async (listId) => {
    await db.collection("lists").doc(listId).delete();
    return listId;   
  }
);