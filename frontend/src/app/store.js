import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import deliveryReducer from "./slices/deliverySlice";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    delivery: deliveryReducer,
    user: userReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 비동기 액션의 pending 상태를 직렬화 체크에서 제외
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
