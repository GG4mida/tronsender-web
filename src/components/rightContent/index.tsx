import React from 'react';
import { Space, Button } from 'antd';
import { useModel, useSelector, Link } from 'umi';
import { UsbOutlined, LinkOutlined, UserOutlined } from '@ant-design/icons';
import { useWallet } from '@/hooks';
import { WalletModelState } from '@/models/wallet';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { connectWallet } = useWallet();

  const { initialState } = useModel('@@initialState');
  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;
  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const handleCollectClick = () => {
    connectWallet();
  };

  const { meta: walletInfo }: WalletModelState = useSelector(
    (state: any) => state.wallet,
  );

  return (
    <Space className={className}>
      {walletInfo.address ? (
        <>
          <Link to="/user">
            <Button type="text" icon={<UserOutlined />}>
              个人中心
            </Button>
          </Link>
          <Button type="dashed" icon={<LinkOutlined />}>
            {walletInfo.address.substring(0, 18) + '...'}
          </Button>
        </>
      ) : (
        <Button
          type="primary"
          danger
          shape="round"
          icon={<UsbOutlined />}
          onClick={handleCollectClick}
        >
          连接钱包
        </Button>
      )}
    </Space>
  );
};
export default GlobalHeaderRight;
