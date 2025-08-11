import { createSlice } from "@reduxjs/toolkit"
import { ListState } from "./list.type";
import { addList, getAllLists, removeList, updateList } from "./list.thunk";
import { IList } from "@/types";

const slice = createSlice({
  name: 'list',
  initialState: { lists: [] } as ListState,
  reducers: {
    updateOrderLists: (state, { payload: { lists } }: { payload: { lists: IList[] } }) => {
      state.lists = lists
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllLists.fulfilled, (state, action) => {
        state.lists = action.payload;
      })
      .addCase(addList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addCase(updateList.fulfilled, (state, action) => {
        state.lists = state.lists.map(list =>
          list.id === action.payload.id ? action.payload : list,
        );
      })
      .addCase(removeList.fulfilled, (state, action) => {
        state.lists = state.lists.filter(list => list.id !== action.payload);
      })
      
  }
})

export const {updateOrderLists} = slice.actions;

export default slice.reducer;