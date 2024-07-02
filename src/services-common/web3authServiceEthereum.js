import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import WalletConnectXrplAdapter from "../adapters/xrplAdapter";
import WalletConnectRopstenAdapter from "../adapters/ropstenEthereumAdapter";
import { CHAIN_NAMESPACES, UX_MODE,WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { XrplPrivateKeyProvider } from "@web3auth/xrpl-provider";
import CustomXrplAdapter from "../adapters/xrplAdapter";

const clientId =
  "BN-2L6cmeBTe-cxrlRDmU3rXCX2Mqzp3eVZwl3FzD3ErySkfUS_Dw1w9n5-yTUcXVJ_SNTutAa3NErPmJDdErUc";

let web3auth;
let defaultProvider = null;

const sepoliaChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", // Sepolia Testnet
  rpcTarget: "https://sepolia.infura.io/v3/c1d59bb6e811406ebf394f114a3df3bb", // Replace with your RPC URL
  displayName: "Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const xrplChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.XRPL,
  chainId: "0x1",
  rpcTarget: "https://testnet.xrpl-labs.com/",
  wsTarget: "wss://testnet.xrpl-labs.com/",
  ticker: "XRP",
  tickerName: "XRPL",
  displayName: "xrpl testnet",
  blockExplorerUrl: "https://testnet.xrpl.org",
};

const initWeb3Auth = async () => {
  try {
    const sepoliaEthereumProvider = new EthereumPrivateKeyProvider({
      config: { chainConfig: sepoliaChainConfig },
    });

    const xrplProvider = new XrplPrivateKeyProvider({
      config: { chainConfig: xrplChainConfig },
    });

    const metamaskAdapter = new MetamaskAdapter({
      clientId,
      chainConfig: sepoliaChainConfig,
    });

    const customXrplAdapter = new CustomXrplAdapter();

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

    web3auth = new Web3Auth({
        clientId: clientId,
        uiConfig: {
          appName: "TripQ",
          theme: {
            primary: "darkblue",
          },
          mode: "dark",
          displayErrorsOnModal: true,
          defaultLanguage: "en",
          loginGridCol: 3,
          primaryButton: "externalLogin",
          uxMode: UX_MODE.REDIRECT,
        },
        web3AuthNetwork: "sapphire_devnet",
        privateKeyProvider: xrplProvider
      });

    // Configure adapters
    await web3auth.configureAdapter(openloginAdapter);
    //await web3authXRPL.configureAdapter(metamaskAdapter);
    await web3auth.configureAdapter(customXrplAdapter);
    
    //await web3auth.addChain(sepoliaChainConfig);
    //await web3auth.addChain(xrplChainConfig);

    await web3auth.initModal();

    console.log("Web3Auth initialized successfully.");
  } catch (error) {
    console.error("Error initializing Web3Auth:", error);
  }
};

export const initializeWeb3AuthConfig = async () => {
   await initWeb3Auth();
};

export const login = async () => {
  try {
    const provider = await web3auth.connect();
    console.log("Provider:", provider);
    return provider;
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await web3auth.logout();
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const authenticateUser = async () => {
  if (!web3auth) {
    console.log("Web3Auth not initialized yet");
    return;
  }
  try {
    console.log("Authenticating user account...", web3auth.provider);

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
