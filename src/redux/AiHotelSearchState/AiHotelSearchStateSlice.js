import { createSlice } from '@reduxjs/toolkit'

const initialSearchedState = {
    hotel_names: [],
    from_date: null,
    to_date: null,
    destination: null,
    total_head_count: 0
};

export const AiHotelSearchStateSlice = createSlice({
    name: 'AiHotelSearch',
    initialState: initialSearchedState,
    reducers: {
        setAiHotelSearchResults: (state, action) => {
            state.hotel_names = action.payload.hotel_names;
            state.from_date = action.payload.from_date;
            state.to_date = action.payload.to_date;
            state.destination = action.payload.destination;
            state.total_head_count = action.payload.total_head_count;
        },
        resetAiHotelSearchState: (state) => {
            state.hotel_names = [];
            state.from_date = null;
            state.to_date = null;
            state.destination = null;
            state.total_head_count = 0;
        }
    },
});

export const { setAiHotelSearchResults, resetAiHotelSearchState } = AiHotelSearchStateSlice.actions;
export default AiHotelSearchStateSlice.reducer
