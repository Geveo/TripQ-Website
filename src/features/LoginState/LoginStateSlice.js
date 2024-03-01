import { createSlice } from '@reduxjs/toolkit'

const initialLoginState = {
    isLoggedIn: false,
    loggedInAddress: null
};

export const loginStateSlice = createSlice({
    name: 'loginState',
    initialState: initialLoginState,
    reducers: {
        loginSuccessfully: (state, action) => {
            state.isLoggedIn = true;
            state.loggedInAddress = action.payload;
        },
        logoutSuccessfully: (state) => {
            state.isLoggedIn = false;
            state.loggedInAddress = null;
        }
    },
});

export const { loginSuccessfully, logoutSuccessfully } = loginStateSlice.actions;
export default loginStateSlice.reducer
