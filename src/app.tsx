import {
  BasicLayoutProps,
  Settings as LayoutSettings,
  PageLoading,
} from '@ant-design/pro-layout';
import { RequestConfig } from 'umi';
import { message } from 'antd';
import { getInfo } from '@/services/system';
import RightContent from '@/components/rightContent';
import Footer from '@/components/footer';
import Storage from '@/utils/storage';
import { STORAGE_KEY } from '@/configs/index';

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 4,
  REDIRECT = 9,
}

interface ErrorInfoStructure {
  success: boolean;
  data?: any;
  errorCode?: string;
  errorMessage?: string;
  showType?: ErrorShowType;
  traceId?: string;
  host?: string;
  [key: string]: any;
}

export const request: RequestConfig = {
  timeout: 30000,
  errorConfig: {
    errorPage: '/account/signin',
  },
  errorHandler: (error: any) => {
    if (error?.request?.options?.skipErrorHandler) {
      throw error;
    }
    let errorInfo: ErrorInfoStructure | undefined;
    if (error.name === 'ResponseError' && error.data && error.request) {
      errorInfo = error.data;
      error.message = errorInfo?.errorMessage || error.message;
      error.data = error.data;
      error.info = errorInfo;
    }
    errorInfo = error.info;

    console.log('errorInfo:', errorInfo);

    if (errorInfo && errorInfo.data) {
      message.error(errorInfo.data);
    } else {
      message.error('服务异常，请稍候重试');
    }
  },
  requestInterceptors: [
    (url, options) => {
      const userId = Storage.getItem(STORAGE_KEY.USER_ID);
      const headers = {
        Authorization: userId,
      };
      return {
        url,
        options: { ...options, headers },
      };
    },
  ],
};

export const dva = {
  config: {
    onError(err: Error) {
      message.error(err.message);
    },
  },
};

export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
}> {
  const fetchSystemInfo = async () => {
    try {
      const response = await getInfo();
      return response?.data || {};
    } catch (error) {}
    return {};
  };

  const {
    name: systemName = '',
    slogan: systemSlogan = '',
    telegram,
    wallet_address,
  } = await fetchSystemInfo();

  const theme = Storage.getItem(STORAGE_KEY.THEME);

  const settings: any = {
    logo: process.env.APP_LOGO,
    name: systemName || process.env.APP_NAME,
    slogan: systemSlogan || process.env.APP_SLOGAN,
    config: {
      telegram,
      wallet_address,
    },
    navTheme: theme || 'dark',
  };

  return {
    settings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: any };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    onPageChange: () => {},
    ...initialState?.settings,
  };
};
