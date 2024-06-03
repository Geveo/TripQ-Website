import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoadPopup: false,
  screenLoaderText: "",
};

export const screenLoaderSlice = createSlice({
  name: "screenLoader",
  initialState,
  reducers: {
    setShowScreenLoader: (state, action) => {
      state.showLoadPopup = action.payload;
    },
    setScreenLoaderText: (state, action) => {
      state.screenLoaderText = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setShowScreenLoader, setScreenLoaderText } = screenLoaderSlice.actions;

export default screenLoaderSlice.reducer;
