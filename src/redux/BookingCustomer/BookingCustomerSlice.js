import { createSlice } from '@reduxjs/toolkit'

const bookingCustomerInitialState = {};

export const bookingCustomerSlice = createSlice({
    name: 'bookingCustomer',
    initialState: bookingCustomerInitialState,
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

export const { add, remove } = bookingCustomerSlice.actions;
export default bookingCustomerSlice.reducer

