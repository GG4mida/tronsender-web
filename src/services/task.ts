import { request } from 'umi';

/**
 * 创建
 * @param data
 * @returns
 */
export async function create(data = {}) {
  return request('/api/task/create', {
    method: 'POST',
    data,
  });
}

/**
 * 更新
 * @param data
 * @returns
 */
export async function update(data = {}) {
  return request('/api/task/update', {
    method: 'POST',
    data,
  });
}

/**
 * 列表
 * @param data
 * @returns
 */
export async function list(data = {}) {
  return request('/api/task/list', {
    method: 'POST',
    data,
  });
}

/**
 * 日志
 * @param data
 * @returns
 */
export async function logs(data = {}) {
  return request('/api/task/logs', {
    method: 'POST',
    data,
  });
}

/**
 * 转账
 * @param data
 * @returns
 */
export async function transfer(data = {}) {
  return request('/api/task/transfer', {
    method: 'POST',
    data,
  });
}

/**
 * 详情
 * @param data
 * @returns
 */
export async function detail(data = {}) {
  return request('/api/task/detail', {
    method: 'GET',
    params: data,
  });
}
