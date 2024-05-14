import { createSlice } from '@reduxjs/toolkit'

const initialSearchedState = {
    hotels: [],
};

export const MoreAiSearchStateSlice = createSlice({
    name: 'MoreAiHotelSearch',
    initialState: initialSearchedState,
    reducers: {
        setMoreAiSearchResults: (state, action) => {
            state.hotels = action.payload.hotels;
        }, 
        resetHotelSearchState: (state) => {
            state.hotels = [];
        }
    },
});

export const { setMoreAiSearchResults, resetHotelSearchState } = MoreAiSearchStateSlice.actions;
export default MoreAiSearchStateSlice.reducer
