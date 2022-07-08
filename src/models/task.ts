'use strict';
import { Effect, ImmerReducer } from 'umi';
import * as Service from '@/services/task';

const DEFAULT_LIST_DATA = {
  count: 0,
  rows: [],
};

export interface TaskModelState {
  detail: object;
  list: {
    count: number;
    rows: Array<any>;
  };
  logs: {
    count: number;
    rows: Array<any>;
  };
}

export interface TaskModelType {
  namespace: 'task';
  state: TaskModelState;
  effects: {
    create: Effect;
    transfer: Effect;
    update: Effect;
    detail: Effect;
    list: Effect;
    logs: Effect;
  };
  reducers: {
    setDetail: ImmerReducer<TaskModelState>;
    resetDetail: ImmerReducer<TaskModelState>;
    setList: ImmerReducer<TaskModelState>;
    resetList: ImmerReducer<TaskModelState>;
    setLogs: ImmerReducer<TaskModelState>;
    resetLogs: ImmerReducer<TaskModelState>;
  };
}

const TaskModel: TaskModelType = {
  namespace: 'task',
  state: {
    detail: {},
    list: { ...DEFAULT_LIST_DATA },
    logs: { ...DEFAULT_LIST_DATA },
  },
  effects: {
    *create({ payload }, { call }) {
      return yield call(Service.create, payload);
    },
    *update({ payload }, { call }) {
      return yield call(Service.update, payload);
    },
    *transfer({ payload }, { call }) {
      return yield call(Service.transfer, payload);
    },
    *detail({ payload }, { call, put }) {
      const response: any = yield call(Service.detail, payload);
      if (response) {
        yield put({ type: 'setDetail', payload: response.data });
      }
      return response;
    },
    *list({ payload }, { call, put }) {
      const response: any = yield call(Service.list, payload);
      if (response) {
        yield put({ type: 'setList', payload: response.data });
      }
      return response;
    },
    *logs({ payload }, { call, put }) {
      const response: any = yield call(Service.logs, payload);
      if (response) {
        yield put({ type: 'setLogs', payload: response.data });
      }
      return response;
    },
  },
  reducers: {
    setDetail(state, action) {
      state.detail = action.payload;
    },
    resetDetail(state) {
      state.detail = {};
    },
    setList(state, action) {
      state.list = action.payload;
    },
    resetList(state) {
      state.list = { ...DEFAULT_LIST_DATA };
    },
    setLogs(state, action) {
      state.logs = action.payload;
    },
    resetLogs(state) {
      state.logs = { ...DEFAULT_LIST_DATA };
    },
  },
};

export default TaskModel;
