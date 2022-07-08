import { DefaultFooter } from '@ant-design/pro-layout';
import { useModel } from 'umi';
import { GithubOutlined } from '@ant-design/icons';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { name, config }: any = initialState?.settings;
  const currentYear = new Date().getFullYear();
  let copyRight = `${currentYear} ${name}`;
  if (config && config.telegram) {
    copyRight += ` - telegram: @${config.telegram}`;
  }
  return (
    <DefaultFooter
      copyright={copyRight}
      links={[
        {
          key: 'manual',
          title: '使用手册',
          href: '/manual',
          blankTarget: false,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/GG4mida/tronsender-web',
          blankTarget: true,
        },
        {
          key: 'faq',
          title: '常见问题',
          href: '/faq',
          blankTarget: false,
        },
      ]}
    />
  );
};
