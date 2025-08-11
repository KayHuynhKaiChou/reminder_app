import { IFormReminder } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'formReminder',
  initialState: { formReminder: {content: '', title: ''}} as FormReminderState,
  reducers: {
    updateFormReminder: (state, { payload: { formReminder } }: FormReminderPayload) => {
      state.formReminder = formReminder
    },
    setDefaultList: (state, { payload: { list } }: FormDefaultListPayload) => {
      state.formReminder.list = list
    },
    resetFormReminder: (state) => {
      state.formReminder = {content: '', title: ''}
    },
  },
});

export const { updateFormReminder, setDefaultList, resetFormReminder } = slice.actions;

export default slice.reducer;

export type FormReminderState = {
  formReminder: IFormReminder
};

type FormReminderPayload = {
  payload: FormReminderState;
};

type FormDefaultListPayload = {
  payload: {list: IFormReminder['list']};
};
