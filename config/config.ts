import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  antd: {
    dark: true,
    compact: false,
  },
  layout: {
    layout: 'top',
    navTheme: 'dark',
    contentWidth: 'Fixed',
  },
  theme: {
    '@primary-color': '#03b386',
    'root-entry-name': 'default',
  },
  routes,
  fastRefresh: {},
  ignoreMomentLocale: true,
  mfsu: false,
  hash: true,
  extraPostCSSPlugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-nested'),
    require('autoprefixer'),
  ],
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
    },
  },
  favicon: '/favicon.png?v=1.0',
  dva: {
    immer: true,
    hmr: false,
  },
  webpack5: {},
  metas: [
    {
      name: 'keywords',
      content:
        '波场空投,波场批量,波场营销,波场备注,波场采集,tron空投,tron批量,tron营销,tron采集,tron airdrop,波场 airdrop',
    },
    {
      name: 'description',
      content:
        '波场 TRC10 批量转账，可添加备注，可实时采集链上活跃地址，极低费率，安全稳定。',
    },
  ],
  define: {
    'process.env.APP_NAME': 'TronSender',
    'process.env.APP_LOGO': '/logo.svg',
    'process.env.APP_SLOGAN': '',
    'process.env.AES_KEY': 'tron_sender',
  },
});
