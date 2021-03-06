import React, { useEffect, useState } from 'react';
import {
  Steps,
  Form,
  Select,
  Upload,
  Button,
  Divider,
  Space,
  Alert,
  Input,
  Spin,
  Result,
  Descriptions,
  message,
} from 'antd';
import type { UploadProps } from 'antd';
import find from 'lodash.find';
import { useSelector, Link, useDispatch, useModel } from 'umi';
import { WalletModelState } from '@/models/wallet';
import { UserModelState } from '@/models/user';
import { useWallet } from '@/hooks';
import WalletAlert from '@/components/walletAlert';
import {
  UploadOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import {
  DATA_SOURCE_TYPE,
  DATA_SOURCE_TYPES,
  SPIDER_DIRECTION_TYPES,
  MANUAL_TYPE,
  MANUAL_TYPES,
  SPIDER_DIRECTION_TYPE,
} from '@/configs';
import { sendToken, sendTransaction } from '@/utils/wallet';
import Decimal from '@/utils/decimal';
import styles from './index.less';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const UPLOAD_CONFIG = {
  limit_size: 100,
  limit_exts: ['xlsx', 'txt'],
};

const TaskPage: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [manualFile, setManualFile] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingTransfer, setLoadingTransfer] = useState(false);
  const [taskMeta, setTaskMeta] = useState<any>(null);
  const { listTokens, loading } = useWallet();
  const { initialState } = useModel('@@initialState');

  const { meta: walletInfo, tokens: walletTokens }: WalletModelState =
    useSelector((state: any) => state.wallet);

  const { profile: userProfile }: UserModelState = useSelector(
    (state: any) => state.user,
  );

  const loadingCreate = useSelector(
    (state: any) => state.loading.effects['task/create'],
  );

  useEffect(() => {
    if (walletInfo.address) {
      listTokens();
    }
  }, [walletInfo]);

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    fileList: manualFile ? [manualFile] : [],
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain',
    maxCount: 1,
    beforeUpload: () => false,
    onRemove: () => {
      setManualFile(null);
    },
    onChange(data) {
      const { file, fileList } = data;
      if (!file || fileList.length === 0) return false;
      const fileType: string = file.name.substring(
        file.name.lastIndexOf('.') + 1,
      );
      const fileSize = (file as any).size / 1024 / 1024;
      if (!UPLOAD_CONFIG.limit_exts.includes(fileType)) {
        message.error('????????????????????????');
        return false;
      }
      if (fileSize > UPLOAD_CONFIG.limit_size) {
        message.error('????????????????????????');
        return false;
      }
      if (!file.status) setManualFile(file);
    },
  };

  const handleTaskSubmit = async () => {
    form
      .validateFields()
      .then(async (values) => {
        const formData: any = new FormData();
        for (const key in values) {
          if (key === 'manual_upload') {
            formData.append('file', manualFile);
          } else {
            formData.append(key, values[key]);
          }
        }
        formData.append('user_id', userProfile.id);
        const res: any = await dispatch({
          type: 'task/create',
          payload: formData,
        });
        if (res && res.success === true) {
          const {
            id,
            address_count,
            address_sum,
            token_id,
            token_name,
            token_decimal,
          } = res.data;
          setTaskMeta({
            id,
            token_id,
            token_name,
            token_decimal,
            address_count,
            address_sum,
          });
          setCurrentStep(currentStep + 1);
        }
      })
      .catch((err) => {
        console.info('validate error:', err);
      });
  };

  const handleRechargeSubmit = async () => {
    const { id, token_id, token_decimal, address_sum } = taskMeta;
    if (!token_id || !address_sum) {
      message.warning('???????????????????????????');
      return;
    }

    const settings: any = initialState?.settings || {};
    const config = settings?.config || {};
    const wallet_address = config?.wallet_address;

    if (!wallet_address) {
      message.warning('??????????????????????????????');
      return;
    }

    let tokenBalance = 0;

    if (token_id === 'trx') {
      tokenBalance = walletInfo.balance;
    } else {
      const tokenInfo = find(walletTokens, { key: token_id });
      if (tokenInfo) {
        tokenBalance = tokenInfo.value;
      }
    }

    if (Decimal.lessThan(tokenBalance, address_sum)) {
      message.error('??????????????????');
      return false;
    }

    try {
      setLoadingTransfer(true);
      let transactionRes = null;
      if (token_id === 'trx') {
        transactionRes = await sendTransaction(wallet_address, address_sum);
      } else {
        transactionRes = await sendToken(
          wallet_address,
          address_sum,
          token_id,
          token_decimal,
        );
      }
      const { txid } = transactionRes;
      if (!txid) {
        setLoadingTransfer(false);
        message.error('????????????');
        return;
      }

      const timer = setTimeout(async () => {
        clearTimeout(timer);
        const data = {
          task_id: id,
          transaction_hash: txid,
        };

        const res: any = await dispatch({
          type: 'task/transfer',
          payload: data,
        });
        if (res && res.success === true) {
          setCurrentStep(2);
        } else {
          message.error(res.data || '??????????????????????????????');
        }

        setLoadingTransfer(false);
      }, 3000);
    } catch (err) {
      setLoadingTransfer(false);
      message.error('??????????????????????????????');
    }
  };

  const handlePreviousClick = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <div className="main-container">
        <div>
          <h1>????????????</h1>
          <p>
            ??????????????????????????????<Link to="/manual">??????????????????</Link>
            ????????????????????????????????????
          </p>
        </div>

        <Divider dashed />

        <WalletAlert />

        {walletInfo.isConnected === true && walletInfo.isMainChain === true ? (
          <Spin spinning={loading}>
            <Steps current={currentStep}>
              <Step title="??????" />
              <Step title="??????" />
              <Step title="??????" />
            </Steps>

            {currentStep === 0 ? (
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  name: '',
                  token_id: 'trx',
                  data_source: DATA_SOURCE_TYPE.MANUAL,
                  manual_type: MANUAL_TYPE.UPLOAD,
                  manual_upload: null,
                  manual_text: '',
                  spider_count: 1000,
                  spider_direction: SPIDER_DIRECTION_TYPE.IN,
                  spider_limit: 10,
                  spider_contract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
                  spider_amount: 1,
                  memo: '',
                }}
                className="tw-mt-8"
                autoComplete="off"
              >
                <Form.Item
                  label="????????????"
                  name="name"
                  rules={[{ required: true, message: '??????????????????' }]}
                >
                  <Input
                    placeholder="?????????..."
                    style={{ width: '100%' }}
                    maxLength={256}
                  />
                </Form.Item>
                <Form.Item
                  label="????????????"
                  name="token_id"
                  rules={[{ required: true, message: '??????????????????' }]}
                >
                  <Select>
                    <Option value="trx" key="trx">
                      <h4>TRX</h4>
                      <span>?????????{walletInfo.balance}</span>
                    </Option>
                    {walletTokens.map((token) => {
                      return (
                        <Option value={token.key} key={token.key}>
                          <h4>{token.meta.abbr}</h4>
                          <span>?????????{token.value}</span>
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="????????????"
                  name="data_source"
                  rules={[{ required: true, message: '??????????????????' }]}
                >
                  <Select>
                    {DATA_SOURCE_TYPES.map((dataSource) => {
                      return (
                        <Option value={dataSource.value} key={dataSource.value}>
                          {dataSource.text}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.data_source !== currentValues.data_source
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('data_source') === DATA_SOURCE_TYPE.MANUAL ? (
                      <Form.Item
                        label="????????????"
                        name="manual_type"
                        rules={[{ required: true, message: '??????????????????' }]}
                      >
                        <Select>
                          {MANUAL_TYPES.map((manualType) => {
                            return (
                              <Option
                                value={manualType.value}
                                key={manualType.value}
                              >
                                {manualType.text}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.data_source !== currentValues.data_source ||
                    prevValues.manual_type !== currentValues.manual_type
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('data_source') === DATA_SOURCE_TYPE.MANUAL &&
                    getFieldValue('manual_type') === MANUAL_TYPE.UPLOAD ? (
                      <div className={styles.upload_container}>
                        <Form.Item
                          label="????????????"
                          name="manual_upload"
                          rules={[{ required: true, message: '??????????????????' }]}
                        >
                          <Upload {...props}>
                            <Button icon={<UploadOutlined />} shape="round">
                              ????????????
                            </Button>
                          </Upload>
                        </Form.Item>
                        <Space className={styles.upload_action}>
                          <a
                            target="_blank"
                            href="/public/template/address.xlsx"
                          >
                            <Button
                              type="dashed"
                              shape="round"
                              icon={<DownloadOutlined />}
                            >
                              excel ????????????
                            </Button>
                          </a>
                          <a
                            target="_blank"
                            href="/public/template/address.txt"
                          >
                            <Button
                              type="dashed"
                              shape="round"
                              icon={<DownloadOutlined />}
                            >
                              txt ????????????
                            </Button>
                          </a>
                        </Space>
                      </div>
                    ) : null
                  }
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.data_source !== currentValues.data_source ||
                    prevValues.manual_type !== currentValues.manual_type
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('data_source') === DATA_SOURCE_TYPE.MANUAL &&
                    getFieldValue('manual_type') === MANUAL_TYPE.TEXT ? (
                      <Form.Item
                        label="????????????"
                        name="manual_text"
                        rules={[{ required: true, message: '??????????????????' }]}
                      >
                        <TextArea
                          rows={8}
                          placeholder="????????????????????????????????????????????????..."
                        />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.data_source !== currentValues.data_source
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('data_source') === DATA_SOURCE_TYPE.SPIDER ? (
                      <>
                        <Form.Item
                          label="????????????"
                          extra="??????????????????????????????????????????????????????????????? USDT"
                          name="spider_contract"
                          rules={[
                            { required: true, message: '??????????????????' },
                            {
                              pattern: /^T[0-9a-zA-Z]{33}$/,
                              message: '??????????????????',
                            },
                          ]}
                        >
                          <Input placeholder="???????????????????????????..." readOnly />
                        </Form.Item>
                        <Form.Item
                          label="????????????"
                          extra="????????????????????????????????????"
                          name="spider_count"
                          rules={[
                            { required: true, message: '??????????????????' },
                            {
                              pattern: /^[1-9]\d{0,6}$/g,
                              message: '??????????????????',
                            },
                          ]}
                        >
                          <Input
                            placeholder="?????????..."
                            style={{ width: '100%' }}
                            maxLength={7}
                          />
                        </Form.Item>
                        <Form.Item
                          label="????????????"
                          name="spider_direction"
                          extra="???????????????????????????????????????"
                          rules={[{ required: true, message: '??????????????????' }]}
                        >
                          <Select>
                            {SPIDER_DIRECTION_TYPES.map((direction) => {
                              return (
                                <Option
                                  value={direction.value}
                                  key={direction.value}
                                >
                                  {direction.text}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="????????????"
                          name="spider_limit"
                          extra="???????????????????????????"
                          rules={[
                            { required: true, message: '??????????????????' },
                            {
                              pattern: /^\d+(.\d{1,12})?$/,
                              message: '??????????????????',
                            },
                          ]}
                        >
                          <Input
                            placeholder="?????????"
                            maxLength={10}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                        <Form.Item
                          label="????????????"
                          extra="?????????????????????????????????"
                          name="spider_amount"
                          rules={[
                            { required: true, message: '??????????????????' },
                            {
                              pattern: /^\d+(.\d{1,12})?$/,
                              message: '??????????????????',
                            },
                          ]}
                        >
                          <Input
                            placeholder="?????????"
                            maxLength={12}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </>
                    ) : null
                  }
                </Form.Item>
                <Form.Item
                  label="????????????"
                  name="memo"
                  extra="???????????????????????????????????????"
                >
                  <Input placeholder="?????????" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loadingCreate}
                    type="primary"
                    shape="round"
                    onClick={handleTaskSubmit}
                  >
                    ????????? <ArrowRightOutlined />
                  </Button>
                </Form.Item>
              </Form>
            ) : null}
            {currentStep === 1 && taskMeta.id ? (
              <Form
                layout="vertical"
                form={form}
                className="tw-mt-8"
                autoComplete="off"
              >
                <Alert
                  message="????????????"
                  type="warning"
                  className="tw-mb-4"
                  description={
                    <ol className="tw-mb-6">
                      <li>
                        ????????????????????????????????????????????????????????????????????????????????????????????????
                      </li>
                      <li>???????????????????????????????????????????????????????????????</li>
                      <li>
                        ????????????????????? <Link to="/manual">????????????</Link>???
                      </li>
                    </ol>
                  }
                />
                <Form.Item>
                  <Descriptions bordered title="????????????" layout="vertical">
                    <Descriptions.Item label="????????????">
                      {`${taskMeta.address_count} ???`}
                    </Descriptions.Item>
                    <Descriptions.Item label="????????????">
                      {`${taskMeta.address_sum} ${taskMeta.token_name}`}
                    </Descriptions.Item>
                  </Descriptions>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button
                      shape="round"
                      disabled={loadingTransfer}
                      onClick={handlePreviousClick}
                    >
                      <ArrowLeftOutlined /> ?????????
                    </Button>
                    <Button
                      loading={loadingTransfer}
                      type="primary"
                      shape="round"
                      onClick={handleRechargeSubmit}
                    >
                      ?????? <ArrowRightOutlined />
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            ) : null}
            {currentStep === 2 && taskMeta.id ? (
              <Result
                status="success"
                title="?????????????????????????????????"
                extra={[
                  <Link to="/user" key="task">
                    <Button type="primary" shape="round">
                      ?????????????????? <ArrowRightOutlined />
                    </Button>
                  </Link>,
                  <Link to="/" key="home">
                    <Button shape="round">????????????</Button>
                  </Link>,
                ]}
              />
            ) : null}
          </Spin>
        ) : null}
      </div>
    </>
  );
};

export default TaskPage;
