import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { ADAPTER_STATUS, CHAIN_NAMESPACES, UX_MODE, WEB3AUTH_NETWORK } from "@web3auth/base";

import { XrplPrivateKeyProvider } from "@web3auth/xrpl-provider";
import CustomXrplAdapter from "../adapters/xrplAdapter";

import {
  deinit,
  init,
  getTransactions,
  getTrustlines,
  getAccountInfo,
} from "../services-common/evernode-xrpl-service";
import {
  showPayQRWindow
} from "../services-common/xumm-api-service";
import { LocalStorageKeys,DestinationTags } from "../constants/constants";

const clientId =
  "BN-2L6cmeBTe-cxrlRDmU3rXCX2Mqzp3eVZwl3FzD3ErySkfUS_Dw1w9n5-yTUcXVJ_SNTutAa3NErPmJDdErUc";

  const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.XRPL,
  chainId: "0x1",
  rpcTarget: "https://testnet.xrpl-labs.com/",
  wsTarget: "wss://testnet.xrpl-labs.com/",
  ticker: "XRP",
  tickerName: "XRPL",
  displayName: "xrpl testnet",
  blockExplorerUrl: "https://testnet.xrpl.org",
};

const chainConfigDevnet = {
  chainNamespace: CHAIN_NAMESPACES.XRPL,
  chainId: "0x2",
  rpcTarget: "https://ripple-node.tor.us",
  wsTarget: "wss://s2.ripple.com",
  ticker: "XRP",
  tickerName: "XRPL",
  displayName: "xrpl mainnet",
  blockExplorerUrl: "https://mainnet.xrpl.org",
};

// const ethereumChainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0x5", 
//   rpcTarget: "https://rpc.ankr.com/eth_goerli",
//   displayName: "Ethereum Testnet",
//   blockExplorerUrl: "https://goerli.etherscan.io",
//   ticker: "ETH",
//   tickerName: "Ethereum testnet",
//   logo: "https://images.toruswallet.io/eth.svg",
// };

let web3auth;
let xrplClient;
const customXrplAdapter = new CustomXrplAdapter();

export const initWeb3Auth = async () => {
  try {
    console.log("Initializing Web3Auth...");
    const xrplProvider = new XrplPrivateKeyProvider({
      config: {
        chainConfig: chainConfig,
      },
    });

    //const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig : ethereumChainConfig } });

    web3auth = new Web3Auth({
      clientId: clientId,
      uiConfig: {
        appName: "TripQ",
        theme: {
          primary: "darkblue",
        },
        mode: "dark",
        displayErrorsOnModal:true,
        //logoLight: "https://web3auth.io/images/web3authlog.png",
       // logoDark: "https://web3auth.io/images/web3authlogodark.png",
        defaultLanguage: "en",
        loginGridCol: 3,
        primaryButton: "externalLogin",
        uxMode: UX_MODE.REDIRECT,
      },
      web3AuthNetwork: "sapphire_devnet",
      privateKeyProvider: xrplProvider,
    });
  

    const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: "none",
      },
      adapterSettings: {
        uxMode: "redirect",
        whiteLabel: {
          logoLight: "https://web3auth.io/images/web3authlog.png",
          logoDark: "https://web3auth.io/images/web3authlogodark.png",
          defaultLanguage: "en",
        },
        mfaSettings: {
          deviceShareFactor: {
            enable: true,
            priority: 1,
            mandatory: true,
          },
          backUpShareFactor: {
            enable: true,
            priority: 2,
            mandatory: false,
          },
          socialBackupFactor: {
            enable: true,
            priority: 3,
            mandatory: false,
          },
          passwordFactor: {
            enable: true,
            priority: 4,
            mandatory: false,
          },
        },
      },
    });

    web3auth.configureAdapter(openloginAdapter);
    web3auth.configureAdapter(customXrplAdapter);

    await web3auth.initModal();
    console.log("Web3Auth initialized successfully.");
  } catch (error) {
    console.error("Error initializing Web3Auth:", error);
  }
};

export const login = async () => {
  try {
    console.log("Attempting to log in...");
    if (web3auth.provider) {
      console.log("Wallet is already connected",web3auth);
  }
    if (web3auth) {
      const res = await web3auth.connect();
      console.log("res::",web3auth.provider)
     
      return res;
    }
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await customXrplAdapter.logout();
    console.log(customXrplAdapter)
    await customXrplAdapter.disconnect();
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const authenticateUser = async () => {
  if (!web3auth) {
    console.log("Web3Auth not initialized yet");
    return;
  }
  try {
    console.log("Authenticating user account...", web3auth.provider)
   
    const idToken = await web3auth.authenticateUser();
    console.log("ID Token:", idToken);
  } catch (error) {
    console.error("Error during authentication:", error);
  }
};

export const getUserInfo = async () => {
  if (!web3auth) {
    console.log("Web3Auth not initialized yet");
    return;
  }
  try {
    const user = await web3auth.getUserInfo();
    console.log("User Info:", user);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const getAccounts = async () => {
  if (!web3auth || !web3auth.provider) {
    console.log("Provider not initialized yet");
    return;
  }

  try {
    const accounts = await web3auth.provider.request({
      method: "xrpl_getAccounts",
    });

    console.log("Accounts:", accounts);
  } catch (error) {
    console.error("Error fetching accounts or account info:", error);
  }
};

export const getBalance = async () => {
  if (web3auth.provider) {
    console.log("Wallet is already connected");
    }

 await init();
  getAccountInfo("rLuYy66zndMYVsxmqwAFrxMQjXHEmBwJDA").then(res => {
    if (res && res.Balance && res.Balance.length > 0) {
      console.log("account balance:::::::::;;", res.Balance)
    }
  
  }).catch(e => {
    throw e
  });
  if (!web3auth || !web3auth.provider) {
    console.log("Provider not initialized yet");
    return;
  }

  try {
    const accounts = await web3auth.provider.request({
      method: "xrpl_getAccounts",
    });

    if (accounts) {
      const accInfo = await web3auth.provider.request({
        method: "account_info",
        params: [
          {
            account: accounts[0],
            strict: true,
            ledger_index: "current",
            queue: true,
          },
        ],
      });
      console.log("XRPL account info", accInfo);
    }
  } catch (error) {
    console.error("Error fetching accounts or account info:", error);
  }
};

export const sendTransaction = async () => {
  if (!web3auth || !web3auth.provider) {
    console.log("Provider not initialized yet");
    return;
  }

  try {
    await showPayQRWindow(localStorage.getItem(LocalStorageKeys.AccountAddress), `rEUxB3VR6CgPsKmY67LzNgzrAU3sRbfRng`,
      "0.6",
      DestinationTags.RESERVATION_PAYMENT,
      "XRP" )
  } catch (error) {
    console.error("Error fetching accounts or account info:", error);
  }
};

export const getXrplClient = () => xrplClient;
