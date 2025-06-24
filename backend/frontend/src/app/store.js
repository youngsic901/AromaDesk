import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // cart: cartReducer, // 나중에 장바구니 슬라이스 추가
  },
});

export default store;
