import React from 'react';
import { Divider } from 'antd';
import SystemAlert from '@/components/systemAlert';

const FaqPage: React.FC = () => {
  return (
    <>
      <div className="main-container">
        <div>
          <h1>常见问题</h1>
        </div>

        <Divider dashed />

        <SystemAlert />

        <h2>转账的费用如何计算？</h2>
        <p>比如你需要批量发送 1000 个地址，每个地址 1TRX。则相关的费用如下：</p>
        <ol>
          <li>
            向系统账户转账（创建任务时）：1TRX * 1000 = 1000
            TRX。这部分是纯粹的转账成本。
          </li>
          <li>
            向系统充值：1TRX * 1000 = 1000
            TRX。这部分包括了链上交易的手续费，以及平台使用的手续费。
          </li>
        </ol>
        <p>共计为：1000TRX + 1000TRX = 2000TRX。除此之外没有任何其它费用。</p>

        <h2>交易手续费是多少？</h2>
        <p>1地址1TRX。新用户会默认赠送 100TRX 账户余额。</p>

        <h2>账户欠费了怎么办？</h2>
        <p>
          如果有运行中的任务，欠费后相关的任务会进入“暂停”状态，账户充值后会自动恢复。
        </p>

        <h2>充值后可以退款吗？</h2>
        <p>可以，请直接联系客服。</p>

        <h2>支持 TRC20 代币吗？</h2>
        <p>不支持。目前仅支持 TRX 及 TRC10 的代币发送。</p>

        <h2>单次任务最大发送地址数量是多少？</h2>
        <p>1000000</p>

        <h2>如何核实任务的发送信息？</h2>
        <p>可前往个人中心查看任务运行状态及发送日志。</p>

        <h2>是否支持私有化部署？</h2>
        <p>请联系客服。</p>
      </div>
    </>
  );
};

export default FaqPage;
