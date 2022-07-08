import React, { useEffect, useState, useRef } from 'react';
import { Modal, Table, Pagination } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { TaskModelState } from '@/models/task';
import Decimal from '@/utils/decimal';
import { ArrowRightOutlined } from '@ant-design/icons';

interface IProp {
  taskInfo: any;
  visible: boolean;
  onClose: () => void;
}

const PAGE_SIZE = 10;

const TaskLogModalPage: React.FC<IProp> = (props) => {
  const { taskInfo, visible, onClose } = props;

  if (taskInfo === null) {
    return null;
  }

  const [pageIndex] = useState(1);

  const pageIndexRef = useRef(pageIndex);

  const {
    id: taskId,
    name: taskName,
    token_name: taskTokenName,
    token_decimal: taskTokenDecimal,
  } = taskInfo;
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible === true) {
      fetchData();
    }
  }, [visible]);

  const { logs: taskLogs }: TaskModelState = useSelector(
    (state: any) => state.task,
  );

  const loading = useSelector(
    (state: any) => state.loading.effects['task/logs'],
  );

  const fetchData = () => {
    dispatch({
      type: 'task/logs',
      payload: {
        task_id: taskId,
        page_index: pageIndexRef.current,
        page_size: PAGE_SIZE,
      },
    });
  };

  const handlePaginationChange = (current: number) => {
    pageIndexRef.current = current;
    fetchData();
  };

  const columns: any = [
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (val: string) => {
        return (
          <a href={`https://tronscan.org/#/address/${val}`} target="_blank">
            {val}
          </a>
        );
      },
    },
    {
      title: `金额（${taskTokenName}）`,
      dataIndex: 'amount',
      key: 'amount',
      width: 200,
      render: (val: string) => {
        return <div>{Decimal.toFixed(val, taskTokenDecimal)}</div>;
      },
    },
    {
      title: '时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 220,
    },
    {
      title: '操作',
      dataIndex: 'hash',
      key: 'hash',
      width: 100,
      render: (val: string) => {
        return (
          <a href={`https://tronscan.org/#/transaction/${val}`} target="_blank">
            交易详情
            <ArrowRightOutlined />
          </a>
        );
      },
    },
  ];

  return (
    <Modal
      title={`${taskName} - 日志记录`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1024}
      destroyOnClose
    >
      <Table
        rowKey="id"
        dataSource={taskLogs.rows}
        pagination={false}
        columns={columns}
        loading={loading}
      />
      <div className="tw-my-4 tw-flex tw-items-center tw-justify-between">
        <div className="tw-opacity-50">{`累计 ${taskLogs.count} 条记录`}</div>
        <Pagination
          size="default"
          total={taskLogs.count}
          current={pageIndexRef.current}
          pageSize={PAGE_SIZE}
          onChange={handlePaginationChange}
        />
      </div>
    </Modal>
  );
};

export default TaskLogModalPage;
