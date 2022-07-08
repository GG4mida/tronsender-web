import React from 'react';
import { Alert, Divider } from 'antd';
import SystemAlert from '@/components/systemAlert';

const ManualPage: React.FC = () => {
  return (
    <>
      <div className="main-container">
        <div>
          <h1>使用手册</h1>
        </div>
        <Divider dashed />

        <SystemAlert />

        <h2>TronLink</h2>
        <p>
          请确保已安装并解锁：
          <a
            href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec"
            target="_blank"
          >
            TronLink 浏览器插件
          </a>
          ，并切换到 TRON 主网。
        </p>
        <h2>任务创建</h2>

        <ol>
          <li>进入“创建任务”页面。</li>
          <li>在“发送币种”列表中，选择你要批量发送的代币。</li>
          <li>选择批量发送的地址来源，当前支持“自行上传”或者“自动采集”。</li>
          <li>如果是自行上传地址信息，请按照上传模板核实你上传文件的格式。</li>
          <li>
            如果是自动采集，可配置采集代币的币种、交易方向、交易限额、数量等信息。
          </li>
        </ol>

        <h2>任务转账</h2>

        <ol>
          <li>数据准备完毕后，需要向系统账号进行转账操作。</li>
          <li>
            转账完成后，任务即创建成功。可前往个人中心查看任务运行状态及发送日志。
          </li>
        </ol>

        <h2>账户充值</h2>

        <ol>
          <li>任务创建成功后，如果账户无余额，则任务会自动置为“暂停”状态。</li>
          <li>
            你可以直接在“个人中心”页面进行充值，充值成功后，任务会自动开启。
          </li>
        </ol>
      </div>
    </>
  );
};

export default ManualPage;
