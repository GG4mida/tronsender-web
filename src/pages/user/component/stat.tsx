import React, { useMemo, useState } from 'react';
import { Row, Col, Statistic, Button } from 'antd';
import { useSelector, Link } from 'umi';
import { UserModelState } from '@/models/user';
import { TaskModelState } from '@/models/task';
import Decimal from '@/utils/decimal';
import { TASK_STATUS } from '@/configs';
import { ArrowRightOutlined } from '@ant-design/icons';
import RechargeCreateModal from './rechargeCreateModal';

const StatPage: React.FC = () => {
  const [rechargeCreateModalVisible, setRechargeCreateModalVisible] =
    useState(false);

  const { profile: userProfile }: UserModelState = useSelector(
    (state: any) => state.user,
  );

  const { list: taskData }: TaskModelState = useSelector(
    (state: any) => state.task,
  );

  const taskStat = useMemo(() => {
    const statData = {
      running: 0,
      total: 0,
    };

    const { rows: taskList } = taskData;
    if (taskList && taskList.length) {
      taskList.forEach((task: any) => {
        const { status } = task;
        if (status === TASK_STATUS.RUNNING) {
          statData.running++;
        }
        statData.total++;
      });
    }
    return statData;
  }, [taskData]);

  const { balance, fee } = userProfile;

  return (
    <div className="tw-mb-4">
      <Row gutter={15}>
        <Col span={6}>
          <Statistic
            title="运行中任务"
            value={taskStat.running}
            suffix={
              <Link to="/task">
                <Button
                  type="link"
                  className="tw-ml-2"
                  style={{
                    position: 'absolute',
                    bottom: '3px',
                  }}
                >
                  创建 <ArrowRightOutlined />
                </Button>
              </Link>
            }
          />
        </Col>
        <Col span={6}>
          <Statistic title="累计创建任务" value={taskStat.total} />
        </Col>
        <Col span={6}>
          <Statistic
            title="账户余额"
            value={`${Decimal.toFixed(balance, 2)} TRX`}
            suffix={
              <Button
                type="link"
                className="tw-ml-2"
                style={{
                  position: 'absolute',
                  bottom: '3px',
                }}
                onClick={() => setRechargeCreateModalVisible(true)}
              >
                充值 <ArrowRightOutlined />
              </Button>
            }
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="账户费率"
            value={`${Decimal.toFixed(fee, 2)} TRX`}
          />
        </Col>
      </Row>
      <RechargeCreateModal
        visible={rechargeCreateModalVisible}
        onClose={() => setRechargeCreateModalVisible(false)}
      />
    </div>
  );
};

export default StatPage;
