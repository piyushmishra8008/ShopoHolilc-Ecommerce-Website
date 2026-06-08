import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
        const item = action.payload;
        const existItem = state.cartItems.find(x => x.productId === item.productId);
        if (existItem) {
          state.cartItems = state.cartItems.map(x =>
            x.productId === existItem.productId
              ? { ...x, qty: item.qty === 1 ? x.qty + 1 : item.qty }
              : x
          );
        } else {
          state.cartItems = [...state.cartItems, item];
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter(x => x.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;