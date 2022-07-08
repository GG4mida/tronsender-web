import React from 'react';
import { Alert } from 'antd';

const SystemAlert: React.FC = () => {
  return (
    <Alert
      message="系统说明"
      type="warning"
      showIcon
      className="tw-mb-4"
      description={
        <ol className="tw-mb-0">
          <li>
            批量转账是由系统账号进行代发。比如你要发送 1000 个地址，每个地址
            1TRX。那你需要先把这 1000 TRX
            转给平台的账号，后续由平台进行调度发送。
          </li>
          <li>
            目前我们的手续费策略是
            1地址1TRX，包含了链上交易的手续费，除此之外没有其它费用。
          </li>
          <li>如果有任何安全方面的疑虑，可咨询客服或直接离开。</li>
        </ol>
      }
    />
  );
};

export default SystemAlert;
