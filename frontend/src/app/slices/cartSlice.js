import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../../api/cartApi";

// 비동기 액션들
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (memberId, { rejectWithValue }) => {
    try {
      const items = await cartApi.getCartItems(memberId);
      return Array.isArray(items) ? items : []; // ✅ 배열 확인 후 반환
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAction = createAsyncThunk(
  "cart/addToCart",
  async ({ memberId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(memberId, productId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuantityAction = createAsyncThunk(
  "cart/updateQuantity",
  async ({ memberId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateQuantity(
        memberId,
        productId,
        quantity
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCartAction = createAsyncThunk(
  "cart/removeFromCart",
  async ({ memberId, productId }, { rejectWithValue }) => {
    try {
      await cartApi.removeFromCart(memberId, productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // CartResponseDTO 배열
    loading: false,
    error: null,
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    updateLocalQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        state.totalQuantity = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : []; // ✅ 방어 코드
        state.totalQuantity = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addToCartAction
      .addCase(addToCartAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAction.fulfilled, (state, action) => {
        state.loading = false;
        const newItem = action.payload;
        const existingIndex = state.items.findIndex(
          (item) => item.productId === newItem.productId
        );

        if (existingIndex !== -1) {
          state.items[existingIndex].quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }

        state.totalQuantity = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      })
      .addCase(addToCartAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateQuantityAction
      .addCase(updateQuantityAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantityAction.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        const index = state.items.findIndex(
          (item) => item.productId === updatedItem.productId
        );

        if (index !== -1) {
          state.items[index] = updatedItem;
        }

        state.totalQuantity = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      })
      .addCase(updateQuantityAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // removeFromCartAction
      .addCase(removeFromCartAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAction.fulfilled, (state, action) => {
        state.loading = false;
        const removedProductId = action.payload;
        state.items = state.items.filter(
          (item) => item.productId !== removedProductId
        );
        state.totalQuantity = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      })
      .addCase(removeFromCartAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCart, updateLocalQuantity } = cartSlice.actions;
export default cartSlice.reducer;
