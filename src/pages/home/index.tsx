import React, { useEffect } from 'react';
import { Button, Space, Row, Col, Card } from 'antd';
import { Link, useModel } from 'umi';
import { ArrowRightOutlined } from '@ant-design/icons';
import Typed from 'typed.js';

const FEATURES = [
  {
    title: '可备注',
    descr: '每笔转账均可附加备注（memo）',
    icon: '/images/message.png',
  },
  {
    title: '可采集',
    descr: '可实时采集链上活跃交易地址',
    icon: '/images/scan.png',
  },
  {
    title: '低费率',
    descr: '平均每笔转账仅需不到 1TRX 手续费',
    icon: '/images/crown.png',
  },
  {
    title: '真安全',
    descr: '不需提供私钥，不需转账授权',
    icon: '/images/safe.png',
  },
  {
    title: '可退款',
    descr: '账户余额可申请全额退款',
    icon: '/images/buy.png',
  },
  {
    title: '很稳定',
    descr: '服务百分百可用，任务必达',
    icon: '/images/stable.png',
  },
];

const HomePage: React.FC = () => {
  useEffect(() => {
    const options = {
      strings: [settings.slogan],
      typeSpeed: 50,
    };
    new Typed('.slogan', options);
  }, []);

  const { initialState } = useModel('@@initialState');
  const settings: any = initialState?.settings || {};

  return (
    <>
      <div className="main-container">
        <div>
          <h2>{settings.name}</h2>
          <p>
            <span className="slogan"></span>
          </p>
          <Space>
            <Link to="/task">
              <Button type="primary" shape="round">
                立即使用
                <ArrowRightOutlined />
              </Button>
            </Link>
            <Link to="/manual">
              <Button shape="round">使用手册</Button>
            </Link>
          </Space>
        </div>
      </div>

      <div className="feature-container">
        <Row gutter={[15, 15]}>
          {FEATURES.map((feature, index) => {
            return (
              <Col span={8} key={index}>
                <Card bordered={false} className="feature-item">
                  <img src={feature.icon} alt="" className="tw-w-10 tw-mb-3" />
                  <h3>{feature.title}</h3>
                  <p className="tw-text-gray-500">{feature.descr}</p>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
};

export default React.memo(HomePage);
