import { widgets } from '@/data';
import { IWidgetSummary } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'home',
  initialState: { isEdit: false, widgets: widgets, fcmToken: {id: '', value: ''}} as HomeState,
  reducers: {
    changeEdit: (state, { payload: { isEdit } }: EditModePayload) => {
      state.isEdit = isEdit;
    },
    updateWidgets: (state, { payload: { widgets } }: WidgetsPayload) => {
      state.widgets = widgets
    },
    updateValueSummary: (state, { payload: { widgetId, value } }: ValuePayload) => {
      const foundWidget =state.widgets.find((widget) => widget.id === widgetId)
      if(foundWidget) 
        foundWidget.value = value
    },
    updateCheckedSummary: (state, { payload: { widgetId, checked } }: CheckedPayload) => {
      const foundWidget =state.widgets.find((widget) => widget.id === widgetId)
      if(foundWidget) foundWidget.checked = checked
    },
    updateTokenDevice: (state, { payload: { fcmToken } }: FcmTokenPayload) => {
      state.fcmToken = fcmToken
    }
  },
});

export const {
  changeEdit,
  updateWidgets,
  updateValueSummary,
  updateCheckedSummary,
  updateTokenDevice,
} = slice.actions;

export default slice.reducer;

export type HomeState = {
  isEdit: boolean;
  widgets: IWidgetSummary[];
  fcmToken: {id: string, value: string};
};

type EditModePayload = {
  payload: {
    isEdit: boolean;
  };
};

type WidgetsPayload = {
  payload: {
    widgets: IWidgetSummary[]
  };
};

type ValuePayload = {
  payload: {
    widgetId: string;
    value: number;
  };
};

type CheckedPayload = {
  payload: {
    widgetId: string;
    checked: boolean;
  };
};

type FcmTokenPayload = {
  payload: {
    fcmToken: {id: string, value: string};
  };
};
