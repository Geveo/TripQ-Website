import { configureStore } from "@reduxjs/toolkit";
import visibleReducer from "./visibility/visibleSlice";
import registerCustomerReducer from "./registerCustomer/registerCustomerSlice";
import transactionListenerReducer from "./transactionListener/transactionListenerSlice";
import loginStateReducer from "./LoginState/LoginStateSlice";
import selectionDetailsReducer from "./SelectionDetails/SelectionDetailsSlice";
import ScreenLoaderReducer from "./screenLoader/ScreenLoaderSlice";
import AiHotelSearchStateReducer from "./AiHotelSearchState/AiHotelSearchStateSlice";
import bookingCustomerReducer from "./BookingCustomer/BookingCustomerSlice";

export const store = configureStore({
  reducer: {
    visibility: visibleReducer,
    registerCustomer: registerCustomerReducer,
    listenedTransactions: transactionListenerReducer,
    loginState: loginStateReducer,
    selectionDetails: selectionDetailsReducer,
    screenLaoder: ScreenLoaderReducer,
    AiHotelSearchState: AiHotelSearchStateReducer,
    bookingCustomer: bookingCustomerReducer
  },
});


