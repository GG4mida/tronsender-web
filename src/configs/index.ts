export const STORAGE_KEY = {
  USER_ID: 'USER_ID',
  THEME: 'THEME',
};

export const DATA_SOURCE_TYPE = {
  MANUAL: 'MANUAL',
  SPIDER: 'SPIDER',
};

export const DATA_SOURCE_TYPES = [
  {
    value: DATA_SOURCE_TYPE.MANUAL,
    text: '自行提供',
  },
  {
    value: DATA_SOURCE_TYPE.SPIDER,
    text: '实时采集',
  },
];

export const MANUAL_TYPE = {
  UPLOAD: 'UPLOAD',
  TEXT: 'TEXT',
};

export const MANUAL_TYPES = [
  {
    value: MANUAL_TYPE.UPLOAD,
    text: '文件上传',
  },
  {
    value: MANUAL_TYPE.TEXT,
    text: '手动输入',
  },
];

export const SPIDER_DIRECTION_TYPE = {
  IN: 'IN',
  OUT: 'OUT',
};

export const SPIDER_DIRECTION_TYPES = [
  {
    value: SPIDER_DIRECTION_TYPE.IN,
    text: '转入',
  },
  {
    value: SPIDER_DIRECTION_TYPE.OUT,
    text: '转出',
  },
];

export const TASK_STATUS = {
  PREPARE: 'PREPARE',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  DONE: 'DONE',
  POOR: 'POOR',
  ILLEGAL: 'ILLEGAL',
};

export const TASK_STATUS_BADGE = {
  [TASK_STATUS.PREPARE]: 'warning',
  [TASK_STATUS.RUNNING]: 'processing',
  [TASK_STATUS.PAUSED]: 'warning',
  [TASK_STATUS.DONE]: 'success',
  [TASK_STATUS.POOR]: 'error',
  [TASK_STATUS.ILLEGAL]: 'error',
};

export const TASK_STATUS_TEXT = {
  [TASK_STATUS.PREPARE]: '待转账',
  [TASK_STATUS.RUNNING]: '运行中',
  [TASK_STATUS.PAUSED]: '已暂停',
  [TASK_STATUS.DONE]: '已完成',
  [TASK_STATUS.POOR]: '已欠费',
  [TASK_STATUS.ILLEGAL]: '非法任务',
};
