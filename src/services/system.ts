import { request } from 'umi';

/**
 * 系统信息
 */
export async function getInfo(data = {}) {
  return request('/api/system/info', {
    method: 'GET',
    params: data,
  });
}
