export default [
  {
    path: '/',
    component: '@/layout',
    flatMenu: true,
    routes: [
      {
        name: '首页',
        icon: 'Home',
        path: '/',
        exact: true,
        component: '@/pages/home/index',
      },
      {
        name: '创建任务',
        icon: 'FormOutlined',
        path: '/task',
        exact: true,
        component: '@/pages/task/index',
      },
      {
        name: '使用手册',
        icon: 'ReadOutlined',
        path: '/manual',
        exact: true,
        component: '@/pages/home/manual',
      },
      {
        name: '常见问题',
        icon: 'QuestionCircleOutlined',
        path: '/faq',
        exact: true,
        component: '@/pages/home/faq',
      },
      {
        name: '个人中心',
        icon: 'UserOutlined',
        path: '/user',
        exact: true,
        hideInMenu: true,
        component: '@/pages/user/index',
      },
      { component: '@/pages/404' },
    ],
  },
];
