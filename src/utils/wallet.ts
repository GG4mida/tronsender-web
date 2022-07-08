import Decimal from './decimal';

const windowThis = window as any;

const isMainChain = (chain: string, fullNode: string) => {
  const fullNodes = ['https://api.trongrid.io', 'https://api.tronstack.io'];
  return chain === '_' && fullNodes.includes(fullNode);
};

const connectToWallet = async () => {
  if (!windowThis.tronLink) return false;
  if (!windowThis.tronWeb) return false;

  const res = await windowThis.tronLink.request({
    method: 'tron_requestAccounts',
  });

  if (!res) return false;

  const { name, base58 } = windowThis.tronWeb.defaultAddress;

  if (base58) {
    const balance = await windowThis.tronWeb.trx.getBalance(base58);

    const { host } = windowThis.tronWeb.fullNode;
    const chain = '_';
    const mainChain = isMainChain(chain, host);

    const walletInfo = {
      address: base58,
      name: name || '',
      balance: fromSun(balance),
      isConnected: true,
      isMainChain: mainChain,
    };
    return walletInfo;
  }

  return false;
};

const getAccount = () => {
  return windowThis.tronWeb.trx.getAccount();
};

const getTokenByID = (tokenId: string | number) => {
  return windowThis.tronWeb.trx.getTokenByID(tokenId);
};

const fromHex = (hex: string) => {
  return windowThis.tronWeb.address.fromHex(hex);
};

const toHex = (str: string) => {
  return windowThis.tronWeb.address.toHex(str);
};

const fromSun = (sun: string, decimal = 6) => {
  let decimalValue = 1;
  for (let i = 0; i < decimal; i++) {
    decimalValue *= 10;
  }

  return Decimal.toFixed(Decimal.div(sun, decimalValue), decimal) + '';
};

const toSun = (str: string | number, decimal = 6) => {
  let decimalValue = 1;
  for (let i = 0; i < decimal; i++) {
    decimalValue *= 10;
  }
  return Decimal.mul(str, decimalValue) + '';
};

const sendToken = (
  to: string,
  amount: number,
  tokenId: string,
  tokenDecimal = 6,
) => {
  const amountSend = toSun(amount, tokenDecimal);
  return windowThis.tronWeb.trx.sendToken(to, amountSend, tokenId);
};

const sendTransaction = (to: string, amount: number) => {
  const amountSend = toSun(amount);
  return windowThis.tronWeb.trx.sendTransaction(to, amountSend);
};

const listTokens = async () => {
  const accountInfo = await getAccount();
  const { assetV2 } = accountInfo;
  const tokens = [];
  if (assetV2 && assetV2.length) {
    for (const asset of assetV2) {
      const { key, value } = asset;
      const tokenInfo = await getTokenByID(key);
      const { precision } = tokenInfo;
      const tokenValue = fromSun(value, precision);

      tokens.push({
        key,
        value: tokenValue,
        meta: tokenInfo,
      });
    }
  }
  return tokens;
};

export {
  connectToWallet,
  listTokens,
  fromHex,
  toHex,
  fromSun,
  toSun,
  getTokenByID,
  isMainChain,
  getAccount,
  sendToken,
  sendTransaction,
};
