import React, { useState } from 'react';
import { Modal, Form, Input, message, Select, Alert } from 'antd';
import { Link, useDispatch, useModel } from 'umi';
import { sendTransaction } from '@/utils/wallet';

const { Option } = Select;

interface IProp {
  visible: boolean;
  onClose: () => void;
}

const RechargeCreateModalPage: React.FC<IProp> = (props) => {
  const { visible, onClose } = props;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { initialState } = useModel('@@initialState');

  const handleSubmitClick = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          setLoading(true);

          const { amount } = values;
          const settings: any = initialState?.settings || {};
          const config = settings?.config || {};
          const wallet_address = config?.wallet_address;

          const transactionRes = await sendTransaction(wallet_address, amount);

          const { txid } = transactionRes;
          if (!txid) {
            setLoading(false);
            message.error('交易失败');
            return;
          }

          const timer = setTimeout(async () => {
            clearTimeout(timer);
            const res: any = await dispatch({
              type: 'recharge/create',
              payload: {
                hash: txid,
              },
            });
            if (res && res.success === true) {
              await dispatch({
                type: 'user/profile',
              });
              await dispatch({
                type: 'task/list',
              });
              onClose();
              message.success('充值成功');
            } else {
              message.error(res.data || '充值失败，请稍候重试');
            }
            setLoading(false);
          }, 3000);
        } catch (err) {
          setLoading(false);
          console.error(err);
          message.error('充值失败，请稍候重试');
        }
      })
      .catch((err) => {
        setLoading(false);
        console.info('validate error:', err);
      });
  };

  return (
    <Modal
      title="账户充值"
      width={640}
      visible={visible}
      onCancel={onClose}
      destroyOnClose
      okText="提交"
      onOk={handleSubmitClick}
      cancelButtonProps={{
        shape: 'round',
      }}
      okButtonProps={{
        loading,
        shape: 'round',
      }}
    >
      <Form
        layout="vertical"
        form={form}
        autoComplete="off"
        initialValues={{
          type: 'TRX',
          amount: '1000',
        }}
      >
        <Alert
          message="系统提示"
          type="warning"
          className="tw-mb-4"
          description={
            <ol className="tw-mb-0">
              <li>
                我们对提供的服务收取1地址1TRX的手续费，该费用已包含了链上的交易费用。除此之外没有任何其它费用。
              </li>
              <li>充值后如需退款，请联系客服。</li>
              <li>如有任何安全方面的顾虑，请勿进行充值操作。</li>
              <li>
                详细说明请阅读 <Link to="/manual">使用手册</Link>。
              </li>
            </ol>
          }
        />
        <Form.Item label="充值币种" name="type">
          <Select>
            <Option value="TRX" key="TRX">
              TRX
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="充值金额"
          name="amount"
          rules={[
            { required: true, message: '字段不能为空' },
            {
              pattern: /^[1-9]\d{0,6}$/g,
              message: '字段格式错误',
            },
          ]}
        >
          <Input
            placeholder="请输入充值金额"
            maxLength={12}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RechargeCreateModalPage;
