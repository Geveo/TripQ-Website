import { createSlice } from '@reduxjs/toolkit'

const selectionDetailsInitialState = {};

export const selectionDetailsSlice = createSlice({
    name: 'selectionDetails',
    initialState: selectionDetailsInitialState,
    reducers: {
        add: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
        remove: (state, action) => {
            const keyToRemove = action.payload;
            delete state[keyToRemove];
        },
    },
});

export const { add, remove } = selectionDetailsSlice.actions;
export default selectionDetailsSlice.reducer

