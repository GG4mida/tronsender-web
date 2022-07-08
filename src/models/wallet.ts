'use strict';
import { ImmerReducer } from 'umi';

const DEFAULT_META = {
  address: '',
  name: '',
  isConnected: false,
  isMainChain: false,
  balance: 0,
};

export interface WalletModelState {
  meta: {
    address: string;
    name: string;
    isConnected: boolean;
    isMainChain: boolean;
    balance: number;
  };
  tokens: Array<{
    key: string | number;
    value: number;
    meta: any;
  }>;
}

export interface WalletModelType {
  namespace: 'wallet';
  state: WalletModelState;
  reducers: {
    setMeta: ImmerReducer<WalletModelState>;
    resetMeta: ImmerReducer<WalletModelState>;
    setTokens: ImmerReducer<WalletModelState>;
  };
}

const WalletModel: WalletModelType = {
  namespace: 'wallet',
  state: {
    meta: { ...DEFAULT_META },
    tokens: [],
  },
  reducers: {
    setMeta(state, action) {
      state.meta = {
        ...state.meta,
        ...action.payload,
      };
    },
    resetMeta(state) {
      state.meta = { ...DEFAULT_META };
    },
    setTokens(state, action) {
      state.tokens = action.payload;
    },
  },
};

export default WalletModel;
