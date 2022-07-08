'use strict';
import { Effect, ImmerReducer } from 'umi';
import * as Service from '@/services/user';
import { STORAGE_KEY } from '@/configs';
import Storage from '@/utils/storage';

const DEFAULT_PROFILE = {
  id: '',
  wallet_address: '',
  fee: '0',
  balance: '0',
};

export interface UserModelState {
  profile: {
    id: string;
    wallet_address: string;
    fee: string;
    balance: string | number;
  };
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    profile: Effect;
  };
  reducers: {
    setProfile: ImmerReducer<UserModelState>;
    resetProfile: ImmerReducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    profile: { ...DEFAULT_PROFILE },
  },
  effects: {
    *profile({ _ }, { call, put, select }) {
      const walletAddress = yield select(
        (state: any) => state.wallet.meta.address,
      );

      if (walletAddress) {
        const params = {
          wallet_address: walletAddress,
        };
        const response: any = yield call(Service.profile, params);
        if (response) {
          const { data: userData } = response;
          yield put({ type: 'setProfile', payload: userData });
        }
        return response;
      }
    },
  },
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
      const { id } = action.payload;
      Storage.setItem(STORAGE_KEY.USER_ID, id);
    },
    resetProfile(state) {
      state.profile = { ...DEFAULT_PROFILE };
      Storage.removeItem(STORAGE_KEY.USER_ID);
    },
  },
};

export default UserModel;
