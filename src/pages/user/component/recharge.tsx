import React, { useEffect } from 'react';
import { Avatar, List, Space, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'umi';
import Decimal from '@/utils/decimal';
import { ArrowRightOutlined } from '@ant-design/icons';
import { RechargeModelState } from '@/models/recharge';

const RechargePage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'recharge/list',
    });
  }, []);

  const { list: rechargeData }: RechargeModelState = useSelector(
    (state: any) => state.recharge,
  );

  const loading = useSelector(
    (state: any) => state.loading.effects['recharge/list'],
  );

  const ListAvatar = () => {
    return <Avatar src="/images/recharge.png" />;
  };

  const ListTitle = (props: any) => {
    const { recharge } = props;
    const { amount } = recharge;
    return (
      <Space>
        <strong>{Decimal.toFixed(amount, 2)} TRX</strong>
      </Space>
    );
  };

  const ListContent = (props: any) => {
    const { recharge } = props;
    const { balance, hash } = recharge;
    return (
      <>
        <div className="tw-mr-4" style={{ width: '160px' }}>
          <label className="tw-opacity-50">账户余额</label>
          <div>{Decimal.toFixed(balance, 2)} TRX</div>
        </div>
        <div className="tw-mr-4" style={{ width: '320px' }}>
          <label className="tw-opacity-50">交易哈希</label>
          <Tooltip title={hash} placement="top">
            <div className="tw-truncate">{hash}</div>
          </Tooltip>
        </div>
      </>
    );
  };

  const ListMeta = (props: any) => {
    const { recharge } = props;
    const { create_time } = recharge;

    return (
      <Space>
        <label>{create_time}</label>
      </Space>
    );
  };

  const ListAction = (recharge: any) => {
    const actions = [];
    actions.push(
      <a
        href={`https://tronscan.org/#/transaction/${recharge.hash}`}
        target="_blank"
      >
        交易详情 <ArrowRightOutlined />
      </a>,
    );
    return actions;
  };

  const ListStat = (props: any) => {
    const { data } = props;
    if (!data || !data.count) {
      return null;
    }
    return (
      <div className="list-stat-container">{`累计 ${data.count} 条记录`}</div>
    );
  };

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={rechargeData.rows}
        loading={loading}
        renderItem={(recharge) => (
          <List.Item actions={ListAction(recharge)}>
            <List.Item.Meta
              avatar={<ListAvatar />}
              title={<ListTitle recharge={recharge} />}
              description={<ListMeta recharge={recharge} />}
            />
            <ListContent recharge={recharge} />
          </List.Item>
        )}
      />
      <ListStat data={rechargeData} />
    </>
  );
};

export default RechargePage;
