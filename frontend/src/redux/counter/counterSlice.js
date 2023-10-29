import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isWalletConnect: false,
  walletData: {},
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    walletConnect: (state, action) => {
      state.isWalletConnect = action.payload
    },
    setWalletData: (state, action) => {
      console.log('action.payload', action.payload);
      state.walletData = action.payload;
      state.isWalletConnect = true;
    },
    setWalletDataBalance: (state, action) => {
      state.walletData.ameBalance = action.payload;
    },
    clearData: (state) => {
      state.walletData = {};
      state.isWalletConnect = false;
    },
  }
});

export const { walletConnect, setWalletData, setWalletDataBalance, clearData } = counterSlice.actions;

export const walletStatus = (state) => state.counter.isWalletConnect;
export const getWalletData = (state) => state.counter.walletData;

export default counterSlice.reducer;
