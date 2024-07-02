import {
  BaseAdapter,
  ADAPTER_CATEGORY,
  ADAPTER_STATUS,
  WalletInitializationError,
  CHAIN_NAMESPACES,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const ropstenChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x3", // Ropsten Testnet
  rpcTarget: "https://ropsten.infura.io/v3/c1d59bb6e811406ebf394f114a3df3bb",
  displayName: "Ropsten Testnet",
  blockExplorerUrl: "https://ropsten.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

class WalletConnectRopstenAdapter extends BaseAdapter {
  constructor() {
    super();
    this.name = "WalletConnectRopsten";
    this.adapterNamespace = CHAIN_NAMESPACES.EIP155;
    this.type = ADAPTER_CATEGORY.EXTERNAL;
    this.status = ADAPTER_STATUS.NOT_READY;
    this.provider = null;
  }

  async init() {
    try {
      this.provider = new EthereumPrivateKeyProvider({
        config: ropstenChainConfig,
      });
      await this.provider.init();
      this.status = ADAPTER_STATUS.READY;
      this.emit(ADAPTER_STATUS.READY);
      console.log("Ropsten Client initialized and connected.");
    } catch (error) {
      console.error("Error initializing Ropsten Client:", error);
      this.status = ADAPTER_STATUS.ERRORED;
      this.emit(ADAPTER_STATUS.ERRORED, error);
      throw WalletInitializationError.notInitializedError(
        "Ropsten Client connection failed"
      );
    }
  }

  async connect() {
    try {
      this.status = ADAPTER_STATUS.CONNECTED;
      this.emit(ADAPTER_STATUS.CONNECTED, {
        provider: this.provider,
      });
      return this.provider;
    } catch (e) {
      this.status = ADAPTER_STATUS.ERRORED;
      this.emit(ADAPTER_STATUS.ERRORED, e);
      throw WalletInitializationError.notConnectedError(
        "Wallet connection failed"
      );
    }
  }

  async disconnect() {
    try {
      await this.provider.disconnect();
      this.status = ADAPTER_STATUS.DISCONNECTED;
      this.provider = null;
      this.emit("disconnected");
    } catch (error) {
      this.emit("error", error);
      throw error;
    }
  }

  async getAccounts() {
    if (this.provider) {
      const accounts = await this.provider.request({
        method: "eth_accounts",
      });
      return accounts;
    } else {
      throw WalletInitializationError.notConnectedError("Wallet not connected");
    }
  }

  async getBalance(address) {
    if (this.provider) {
      const balance = await this.provider.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      return balance;
    } else {
      throw WalletInitializationError.notConnectedError("Wallet not connected");
    }
  }
}

export default WalletConnectRopstenAdapter;
