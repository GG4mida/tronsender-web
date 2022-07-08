import React, { useEffect } from 'react';
import { ConfigProvider, Alert, message } from 'antd';
import { useModel, useDispatch } from 'umi';
import { WaterMark } from '@ant-design/pro-layout';
import zhCN from 'antd/lib/locale/zh_CN';
import Browser from '@/utils/browser';
import { useWallet } from '@/hooks';

import 'moment/locale/zh-cn';

const BrowserHappy = () => {
  if (Browser.isChrome()) {
    return null;
  }
  return (
    <Alert
      className="tw-text-center"
      showIcon={false}
      type="error"
      message={
        <div>
          本站功能仅支持 Google Chrome 浏览器：
          <a href="https://www.google.cn/chrome/" target="_blank">
            前往下载
          </a>
        </div>
      }
      banner
    />
  );
};

const Container: React.FC<any> = (props) => {
  const { initMessage, connectWallet } = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    const resetProfile = async () => {
      await dispatch({
        type: 'user/resetProfile',
      });
    };

    resetProfile().then(() => {
      initMessage();
      connectWallet();
    });

    message.config({
      maxCount: 1,
      duration: 5,
    });
  }, []);

  const { initialState } = useModel('@@initialState');
  const settings: any = initialState?.settings;
  const waterMarkContent = settings.name;

  return (
    <ConfigProvider locale={zhCN} componentSize="middle">
      <BrowserHappy />
      <WaterMark content={waterMarkContent} {...props}>
        {props.children}
      </WaterMark>
    </ConfigProvider>
  );
};

export default Container;
