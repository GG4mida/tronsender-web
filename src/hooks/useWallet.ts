import { useCallback, useState } from 'react';
import { message } from 'antd';
import { useDispatch } from 'umi';
import * as wallet from '@/utils/wallet';

interface IReturnInteface {
  loading: boolean;
  initMessage: () => any;
  connectWallet: () => any;
  listTokens: () => any;
}

export const useWallet = (): IReturnInteface => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // 初始化钱包消息监听
  const initMessage = useCallback(() => {
    window.addEventListener('message', (msg) => {
      const { message } = msg.data;
      if (!message) return;
      if (
        message.action === 'setAccount' ||
        message.action === 'setNode' ||
        message.action === 'tabReply' ||
        message.action === 'accountsChanged'
      ) {
        if (message.data.address) {
          connectWallet();
        }
      }
      if (message.action === 'disconnectWeb') {
        dispatch({
          type: 'wallet/resetMeta',
        });
      }
    });
  }, []);

  // 连接钱包插件
  const connectWallet = useCallback(async () => {
    setLoading(true);
    const res: any = await wallet.connectToWallet();
    if (res === false) {
      message.warning('请安装并解锁 TronLink 浏览器插件');
    } else {
      await dispatch({
        type: 'wallet/setMeta',
        payload: res,
      });

      await dispatch({
        type: 'user/profile',
      });

      await dispatch({
        type: 'task/list',
      });
    }
    setLoading(false);
  }, []);

  // 查询 trc10 代币列表
  const listTokens = useCallback(async () => {
    setLoading(true);
    const tokens = await wallet.listTokens();
    await dispatch({
      type: 'wallet/setTokens',
      payload: tokens,
    });
    setLoading(false);
  }, []);

  return {
    initMessage,
    connectWallet,
    listTokens,
    loading,
  };
};
