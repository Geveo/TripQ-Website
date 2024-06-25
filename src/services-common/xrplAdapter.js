import {
  BaseAdapter,
  ADAPTER_CATEGORY,
  ADAPTER_STATUS,
  WalletInitializationError,
} from "@web3auth/base";
import { Client, dropsToXrp, Wallet } from "xrpl";
import { Xumm } from "xumm";
import { CHAIN_NAMESPACES, UX_MODE, WEB3AUTH_NETWORK } from "@web3auth/base";
import { XrplPrivateKeyProvider } from "@web3auth/xrpl-provider";
import { xummAuthorize, xummLogout } from "../services-common/xumm-api-service";
import { LocalStorageKeys } from "../constants/constants";

let xumm = null;
let xrplProvider;

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

class WalletConnectXrplAdapter extends BaseAdapter {
  constructor() {
    super();
    this.name = "Login with Xaman";
    this.adapterNamespace = "xrpl";
    this.type = ADAPTER_CATEGORY.EXTERNAL;
    this.status = ADAPTER_STATUS.NOT_READY;
    this.wallet = null;
    this.connector = null;
    this.client = new Client("wss://testnet.xrpl-labs.com/");
    this.provider = null; // Add provider property
  }

  async init() {
    try {
      xrplProvider = new XrplPrivateKeyProvider({
        config: {
          chainConfig: chainConfig,
        },
      });

      console.log("Initializing XRPL Client...");
      await this.client.connect();
      this.status = ADAPTER_STATUS.READY;
      this.emit(ADAPTER_STATUS.READY);
      console.log("XRPL Client initialized and connected.");
    } catch (error) {
      console.error("Error initializing XRPL Client:", error);
      this.status = ADAPTER_STATUS.ERRORED;
      this.emit(ADAPTER_STATUS.ERRORED, error);
      throw WalletInitializationError.notInitializedError(
        "XRPL Client connection failed"
      );
    }
  }

  async connect() {
    try {
      const res = await xummAuthorize();
      console.log(res);
      if (res) {
        console.log(localStorage.getItem(LocalStorageKeys.AccountAddress));

        // Setting up the provider
        this.provider = xrplProvider;
        this.status = ADAPTER_STATUS.CONNECTED;

        this.emit(ADAPTER_STATUS.CONNECTED, {
          provider: this.provider,
          wallet: this.wallet,
        });
        return this.wallet;
      }
    } catch (e) {
      console.log(e);
      this.status = ADAPTER_STATUS.ERRORED;
      this.emit(ADAPTER_STATUS.ERRORED, e);
      throw WalletInitializationError.notConnectedError(
        "Wallet connection failed"
      );
    }
    return false;
  }

  async disconnect() {
    console.log('Custom XRPL Adapter: Logging out...');
    try {
      await xummLogout();
     // await this.client.disconnect();
      this.status = ADAPTER_STATUS.DISCONNECTED;
      this.wallet = null;
      this.provider = null;
      this.emit('disconnected');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async getAccounts() {
    if (this.provider) {
      return [this.provider.account.address];
    } else {
      throw WalletInitializationError.notConnectedError("Wallet not connected");
    }
  }

  async getBalance() {
    console.log("SSSWww");
    if (this.provider) {
      const accountInfo = await this.provider.client.request({
        command: "account_info",
        account: this.provider.account.address,
        ledger_index: "validated",
      });
      return dropsToXrp(accountInfo.result.account_data.Balance);
    } else {
      throw WalletInitializationError.notConnectedError("Wallet not connected");
    }
  }

  async signTransaction(tx) {
    if (this.provider) {
      const signedTx = await xumm.payload.createAndSign(tx);
      return signedTx;
    } else {
      throw WalletInitializationError.notConnectedError("Wallet not connected");
    }
  }

  async sendTransaction(signedTx) {
    if (this.provider && signedTx) {
      const response = await this.provider.client.submitAndWait(signedTx);
      return response;
    } else {
      throw new Error("Client not initialized or invalid transaction data.");
    }
  }
}

export default WalletConnectXrplAdapter;
