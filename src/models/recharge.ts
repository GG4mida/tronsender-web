'use strict';
import { Effect, ImmerReducer } from 'umi';
import * as Service from '@/services/recharge';

export interface RechargeModelState {
  list: {
    count: number;
    rows: Array<any>;
  };
}

export interface RechargeModelType {
  namespace: 'recharge';
  state: RechargeModelState;
  effects: {
    create: Effect;
    list: Effect;
  };
  reducers: {
    setList: ImmerReducer<RechargeModelState>;
  };
}

const RechargeModel: RechargeModelType = {
  namespace: 'recharge',
  state: {
    list: {
      count: 0,
      rows: [],
    },
  },
  effects: {
    *create({ payload }, { call }) {
      return yield call(Service.create, payload);
    },
    *list({ payload }, { call, put }) {
      const response: any = yield call(Service.list, payload);
      if (response) {
        yield put({ type: 'setList', payload: response.data });
      }
      return response;
    },
  },
  reducers: {
    setList(state, action) {
      state.list = action.payload;
    },
  },
};

export default RechargeModel;
