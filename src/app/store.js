import { configureStore } from "@reduxjs/toolkit";
import visibleReducer from "../features/visibility/visibleSlice";
import registerCustomerReducer from "../features/registerCustomer/registerCustomerSlice";
import transactionListenerReducer from "./../features/transactionListener/transactionListenerSlice";
import loginStateReducer from "./../features/LoginState/LoginStateSlice";

export const store = configureStore({
  reducer: {
    visibility: visibleReducer,
    registerCustomer: registerCustomerReducer,
    listenedTransactions: transactionListenerReducer,
    loginState: loginStateReducer
  },
});


