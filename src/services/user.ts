import { request } from 'umi';

/**
 * 详情
 */
export async function profile(data = {}) {
  return request('/api/user/profile', {
    method: 'POST',
    data,
  });
}
