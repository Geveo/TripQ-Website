import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: false,
};

export const screenLoaderSlice = createSlice({
  name: "screenLoader",
  initialState,
  reducers: {
    setShowScreenLoader: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setShowScreenLoader } = screenLoaderSlice.actions;

export default screenLoaderSlice.reducer;
