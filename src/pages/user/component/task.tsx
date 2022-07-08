import React, { useState } from 'react';
import {
  Button,
  Avatar,
  List,
  Space,
  Tooltip,
  Badge,
  Modal,
  Divider,
  message,
} from 'antd';
import { useSelector, useDispatch } from 'umi';
import { TaskModelState } from '@/models/task';
import {
  DATA_SOURCE_TYPE,
  TASK_STATUS,
  TASK_STATUS_BADGE,
  TASK_STATUS_TEXT,
} from '@/configs';
import Decimal from '@/utils/decimal';
import {
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import TaskLogModal from './taskLogModal';

const { confirm } = Modal;

const TaskPage: React.FC = () => {
  const [taskLogVisible, setTaskLogVisible] = useState(false);
  const [taskInfo, setTaskInfo] = useState(null);

  const dispatch = useDispatch();

  const { list: taskData }: TaskModelState = useSelector(
    (state: any) => state.task,
  );

  const loading = useSelector(
    (state: any) => state.loading.effects['task/list'],
  );

  const handleTaskLogClick = (taskInfo: any) => {
    setTaskInfo(taskInfo);
    setTaskLogVisible(true);
  };

  const handleTaskLogClose = () => {
    setTaskInfo(null);
    setTaskLogVisible(false);
  };

  const handleActionClick = (status: string, id: string) => {
    const actionNames = {
      [TASK_STATUS.PAUSED]: '暂停',
      [TASK_STATUS.RUNNING]: '启动',
    };
    const actionName = actionNames[status];
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定${actionName}该任务吗？`,
      onOk: async () => {
        try {
          const res: any = await dispatch({
            type: 'task/update',
            payload: {
              task_id: id,
              status: status,
            },
          });
          const { success } = res;
          if (success === true) {
            message.success('任务操作成功');
            dispatch({
              type: 'task/list',
            });
          }
        } catch (err) {
          message.error('任务操作失败，请稍候重试');
        }
      },
    });
  };

  const ListAvatar = (props: any) => {
    const { task } = props;
    const { data_source } = task;
    const avatarImg =
      data_source === DATA_SOURCE_TYPE.MANUAL
        ? '/images/manual.png'
        : '/images/spider.png';
    const avatarTooltip =
      data_source === DATA_SOURCE_TYPE.MANUAL ? '上传数据' : '采集数据';
    return (
      <Tooltip title={avatarTooltip} placement="top">
        <Avatar src={avatarImg} />
      </Tooltip>
    );
  };

  const ListTitle = (props: any) => {
    const { task } = props;
    const { name, status } = task;

    const badgeType: any = TASK_STATUS_BADGE[status];
    const badgeText = TASK_STATUS_TEXT[status];

    return (
      <Space>
        <strong>{name}</strong>
        <Badge status={badgeType} text={badgeText} />
      </Space>
    );
  };

  const ListContent = (props: any) => {
    const { task } = props;
    const { create_time, done_time } = task;
    return (
      <>
        <div className="tw-w-40 tw-mr-10">
          <label className="tw-opacity-50">创建时间</label>
          <div>{create_time}</div>
        </div>
        <div className="tw-w-40">
          <label className="tw-opacity-50">完成时间</label>
          <div>{done_time || '-'}</div>
        </div>
      </>
    );
  };

  const ListMeta = (props: any) => {
    const { task } = props;
    const {
      data_source,
      spider_count,
      spider_amount,
      address_count,
      address_sum,
      log_count,
      log_sum,
      token_name,
      token_decimal,
    } = task;

    const addressCount =
      data_source === DATA_SOURCE_TYPE.MANUAL ? address_count : spider_count;
    const addressSum =
      data_source === DATA_SOURCE_TYPE.MANUAL
        ? address_sum
        : Decimal.mul(spider_count, spider_amount);

    const logSumFormated = Decimal.toFixed(log_sum, token_decimal);
    const addressSumFormated = Decimal.toFixed(addressSum, token_decimal);

    return (
      <Space>
        <span>地址：{`${log_count} / ${addressCount} 个`}</span>
        <Divider type="vertical" />
        <span>
          金额：{`${logSumFormated} / ${addressSumFormated} ${token_name}`}
        </span>
      </Space>
    );
  };

  const ListAction = (task: any) => {
    const actions = [];

    if (task.status === TASK_STATUS.RUNNING) {
      actions.push(
        <Button
          type="primary"
          danger
          size="small"
          onClick={() => handleActionClick(TASK_STATUS.PAUSED, task.id)}
        >
          暂停 <StopOutlined />
        </Button>,
      );
    }

    if (task.status === TASK_STATUS.PAUSED) {
      actions.push(
        <Button
          type="primary"
          size="small"
          onClick={() => handleActionClick(TASK_STATUS.RUNNING, task.id)}
        >
          启动 <CaretRightOutlined />
        </Button>,
      );
    }

    actions.push(
      <a href="#!" onClick={() => handleTaskLogClick(task)}>
        查看日志 <ArrowRightOutlined />
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
        dataSource={taskData.rows}
        loading={loading}
        renderItem={(task) => (
          <List.Item actions={ListAction(task)}>
            <List.Item.Meta
              avatar={<ListAvatar task={task} />}
              title={<ListTitle task={task} />}
              description={<ListMeta task={task} />}
            />
            <ListContent task={task} />
          </List.Item>
        )}
      />

      <ListStat data={taskData} />

      <TaskLogModal
        visible={taskLogVisible}
        taskInfo={taskInfo}
        onClose={handleTaskLogClose}
      />
    </>
  );
};

export default TaskPage;
