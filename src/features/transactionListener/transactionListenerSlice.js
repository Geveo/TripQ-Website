import { createSlice } from '@reduxjs/toolkit'

const listenedTransactionsInitialState = {};

export const transactionListenerSlice = createSlice({
    name: 'listenedTransactions',
    initialState: listenedTransactionsInitialState,
    reducers: {
        add: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
        remove: (state, action) => {
            const keyToRemove = action.payload;
            delete state[keyToRemove];
        },
        removeAll: (state) => {
            Object.keys(state).forEach(key => {
                delete state[key];
            })
        }
    },
});

export const { add, remove, removeAll } = transactionListenerSlice.actions;
export default transactionListenerSlice.reducer

