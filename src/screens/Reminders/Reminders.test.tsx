// Reminders.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Reminders from './Reminders';
import { NavigationHomeProp } from '@/types';
import { Provider } from 'react-redux';
import { store } from '@/store';

jest.mock('@/store/reminder/reminder.thunk', () => {
  const actualThunk = jest.requireActual('@/store/reminder/reminder.thunk');
  return actualThunk;
});

jest.mock('@/hooks/useAppDispatch', () => () => jest.fn());

jest.mock('@/hooks/useNotifee', () => () => jest.fn());

jest.mock('@/components/PopupMenu/PopupMenuDotThree', () => () => (
  <></>
));

describe('Reminders component', () => {
  const navigation = {
    navigate: jest.fn(),
    setOptions: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(),
  };

  const listId = 'list-123';

  const reminders = [
    { id: 'reminder-1', listId, title: 'Reminder 1' },
    { id: 'reminder-2', listId, title: 'Reminder 2' },
  ];

  const lists = [{ id: listId, name: 'List 1' }];

  const route = {
    params: { listId },
  };

  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders reminders list', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Reminders
          navigation={navigation}
          route={route}
          lists={lists}
          reminders={reminders}
          dispatch={dispatch}
        />
      </Provider>
    );

    expect(getByText('Reminder 1')).toBeTruthy();
    expect(getByText('Reminder 2')).toBeTruthy();
  });

  it('calls addReminder when add button is pressed', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <Reminders
          navigation={navigation}
          route={route}
          lists={lists}
          reminders={reminders}
          dispatch={dispatch}
        />
      </Provider>
    );

    const addButton = getByText('Add Reminder');
    fireEvent.press(addButton);

    await waitFor(() => expect(dispatch).toHaveBeenCalledTimes(1));
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ADD_REMINDER',
      })
    );
  });

  it('calls removeList when delete button is pressed', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <Reminders
          navigation={navigation}
          route={route}
          lists={lists}
          reminders={reminders}
          dispatch={dispatch}
        />
      </Provider>
    );

    const deleteButton = getByText('Delete List');
    fireEvent.press(deleteButton);

    await waitFor(() => expect(dispatch).toHaveBeenCalledTimes(1));
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'REMOVE_LIST',
      })
    );
  });

  it('calls updateList when show completed button is pressed', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <Reminders
          navigation={navigation}
          route={route}
          lists={lists}
          reminders={reminders}
          dispatch={dispatch}
        />
      </Provider>
    );

    const showCompletedButton = getByText('Show Completed');
    fireEvent.press(showCompletedButton);

    await waitFor(() => expect(dispatch).toHaveBeenCalledTimes(1));
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'UPDATE_LIST',
      })
    );
  });
});