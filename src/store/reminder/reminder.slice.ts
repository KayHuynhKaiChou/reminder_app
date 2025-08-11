import { createSlice } from '@reduxjs/toolkit';
import {
  ReminderState
} from './reminder.type';
import { addReminder, getAllreminders, removeMultipleReminderByListId, removeReminder, updateFieldDetailReminder, updateFieldListReminder, updateReminder } from './reminder.thunk';

const slice = createSlice({
  name: 'reminder',
  initialState: { reminders: [] } as ReminderState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllreminders.fulfilled, (state, action) => {
        state.reminders = action.payload;
      })
      .addCase(addReminder.fulfilled, (state, action) => {
        state.reminders.push(action.payload);
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        const index = state.reminders.findIndex(reminder => reminder.id === action.payload.id);
        if (index !== -1) {
          state.reminders[index] = action.payload;
        }
      })
      .addCase(removeReminder.fulfilled, (state, action) => {
        const reminderId = action.payload;
        state.reminders = state.reminders
          .filter(reminder => reminder.id !== reminderId);
      })
      .addCase(removeMultipleReminderByListId.fulfilled, (state, action) => {
        const listId = action.payload;
        state.reminders = state.reminders
          .filter(reminder => reminder.listId !== listId);
      })
      .addCase(updateFieldDetailReminder.fulfilled, (state, action) => {
        const {reminderId, detail} = action.payload;
        const index = state.reminders.findIndex(reminder => reminder.id === reminderId);
        if (index !== -1) {
          state.reminders[index] = {
            ...state.reminders[index],
            detail
          };
        }
      })
      .addCase(updateFieldListReminder.fulfilled, (state, action) => {
        const {reminderId, listId} = action.payload;
        const index = state.reminders.findIndex(reminder => reminder.id === reminderId);
        if (index !== -1) {
          state.reminders[index] = {
            ...state.reminders[index],
            listId
          };
        }
      })
  },
});

export const {} = slice.actions;

export default slice.reducer;
