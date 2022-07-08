import { request } from 'umi';

/**
 * 列表
 */
export async function list(data = {}) {
  return request('/api/recharge/list', {
    method: 'POST',
    data: data,
  });
}

/**
 * 创建
 */
export async function create(data = {}) {
  return request('/api/recharge/create', {
    method: 'post',
    data: data,
  });
}
