import React, { useEffect } from 'react';
import { Tabs, Divider } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Stat from './component/stat';
import Task from './component/task';
import Recharge from './component/recharge';
import WalletAlert from '@/components/walletAlert';
import { WalletModelState } from '@/models/wallet';

const { TabPane } = Tabs;

const REFRESH_INTERVAL = 1000 * 15;

const UserPage: React.FC = () => {
  const dispatch = useDispatch();

  const { meta: walletInfo }: WalletModelState = useSelector(
    (state: any) => state.wallet,
  );

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      fetchData();
    }, REFRESH_INTERVAL);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const fetchData = () => {
    dispatch({
      type: 'user/profile',
    });
    dispatch({
      type: 'task/list',
    });
  };

  return (
    <>
      <div className="main-container">
        <div>
          <h1>个人中心</h1>
        </div>
        <Divider dashed />
        <WalletAlert />
        {walletInfo.isConnected === true && walletInfo.isMainChain === true ? (
          <>
            <Stat />
            <Tabs defaultActiveKey="task">
              <TabPane tab="任务列表" key="task">
                <Task />
              </TabPane>
              <TabPane tab="充值记录" key="recharge">
                <Recharge />
              </TabPane>
            </Tabs>
          </>
        ) : null}
      </div>
    </>
  );
};

export default UserPage;
