import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: false,
}

export const visibleSlice = createSlice({
    name: 'visibility',
    initialState,
    reducers: {
        show: (state) => {
            state.value = true
        },
        hide: (state) => {
            state.value = false
        },
    },
})

// Action creators are generated for each case reducer function
export const { show, hide } = visibleSlice.actions

export default visibleSlice.reducer

