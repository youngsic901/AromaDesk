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

// 총 수량과 금액 계산 함수 (중복 제거)
const calculateTotals = (items) => {
  const totalQuantity = (items || []).reduce(
    (total, item) => total + (item?.quantity || 0),
    0
  );
  const totalAmount = (items || []).reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
    0
  );
  return { totalQuantity, totalAmount };
};

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
      const item = (state.items || []).find(
        (item) => item?.productId === productId
      );
      if (item) {
        item.quantity = quantity;
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
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
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
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

        // newItem이 유효하지 않으면 처리하지 않음
        if (!newItem || !newItem.productId) {
          console.warn("유효하지 않은 상품 데이터:", newItem);
          return;
        }

        // state.items가 undefined면 빈 배열로 초기화
        if (!state.items) {
          state.items = [];
        }

        const existingIndex = state.items.findIndex(
          (item) => item?.productId === newItem.productId
        );

        if (existingIndex !== -1) {
          // 기존 상품이 있으면 수량 추가
          const existingItem = state.items[existingIndex];
          if (existingItem && typeof existingItem.quantity === "number") {
            existingItem.quantity += newItem.quantity || 1;
          } else {
            existingItem.quantity = newItem.quantity || 1;
          }
        } else {
          // 새 상품 추가
          state.items.push({
            ...newItem,
            quantity: newItem.quantity || 1,
          });
        }

        // 총 수량과 금액 계산
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(addToCartAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // 재고 부족 오류인 경우 사용자에게 알림
        if (action.payload && action.payload.includes("재고")) {
          alert(action.payload);
        }
      })

      // updateQuantityAction
      .addCase(updateQuantityAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantityAction.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        const index = (state.items || []).findIndex(
          (item) => item?.productId === updatedItem?.productId
        );

        if (index !== -1) {
          state.items[index] = updatedItem;
        }

        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(updateQuantityAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // 재고 부족 오류인 경우 사용자에게 알림
        if (action.payload && action.payload.includes("재고")) {
          alert(action.payload);
        }
      })

      // removeFromCartAction
      .addCase(removeFromCartAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAction.fulfilled, (state, action) => {
        state.loading = false;
        const removedProductId = action.payload;
        state.items = (state.items || []).filter(
          (item) => item?.productId !== removedProductId
        );
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      .addCase(removeFromCartAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCart, updateLocalQuantity } = cartSlice.actions;
export default cartSlice.reducer;
