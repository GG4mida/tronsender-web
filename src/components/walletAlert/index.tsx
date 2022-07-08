import React from 'react';
import { useSelector } from 'umi';
import { Button, Result } from 'antd';
import { WalletModelState } from '@/models/wallet';
import { useWallet } from '@/hooks';
import { UsbOutlined } from '@ant-design/icons';

const WalletAlert: React.FC = () => {
  const { connectWallet } = useWallet();

  const { meta: walletInfo }: WalletModelState = useSelector(
    (state: any) => state.wallet,
  );

  const handleConnectClick = () => {
    connectWallet();
  };

  if (walletInfo.isConnected === false) {
    return (
      <Result
        status="500"
        subTitle="请安装并解锁 TronLink 浏览器插件"
        extra={
          <Button
            type="primary"
            danger
            shape="round"
            icon={<UsbOutlined />}
            onClick={handleConnectClick}
          >
            连接钱包
          </Button>
        }
      />
    );
  }

  if (walletInfo.isMainChain === false) {
    return <Result status="500" subTitle="请切换 TronLink 网络为 TRON 主网" />;
  }

  return null;
};

export default WalletAlert;
