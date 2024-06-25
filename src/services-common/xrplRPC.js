import { convertStringToHex, xrpToDrops } from "xrpl";
import { IProvider } from "@web3auth/base";
import { Client } from "xrpl";

class XrplRPC {
  constructor(provider) {
    this.provider = provider;
  }

  getAccounts = async () => {
    try {
      const accounts = await this.provider.request({
        method: "xrpl_getAccounts",
      });
      if (accounts) {
        const accInfo = await this.provider.request({
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
        return accInfo;
      } else {
        return "No accounts found, please report this issue.";
      }
    } catch (error) {
      console.error("Error", error);
      return error;
    }
  };

  getBalance = async () => {
    try {
        const accounts = await this.provider.request({
          method: 'xrpl_getAccounts',
        });
  
        if (accounts) {
          const accInfo = await this.provider.request({
            method: 'account_info',
            params: {
              account: accounts[0],
              strict: true,
              ledger_index: 'current',
              queue: true,
            },
          });
          console.log(accInfo.account_data)
          return accInfo.account_data?.Balance;
        } else {
          return 'No accounts found, please report this issue.';
        }
      } catch (error) {
        console.error('Error', error);
        return error;
      }
  };

  signMessage = async () => {
    try {
      const msg = "Hello world";
      const hexMsg = convertStringToHex(msg);
      const txSign = await this.provider.request({
        method: "xrpl_signMessage",
        params: {
          signature: hexMsg,
        },
      });
      return txSign;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };

  signAndSendTransaction = async () => {
    try {
      const accounts = await this.provider.request({
        method: "xrpl_getAccounts",
      });

      if (accounts && accounts.length > 0) {
        const tx = {
          TransactionType: "Payment",
          Account: accounts[0],
          Amount: xrpToDrops(50),
          Destination: "rM9uB4xzDadhBTNG17KHmn3DLdenZmJwTy",
        };
        const txSign = await this.provider.request({
          method: "xrpl_submitTransaction",
          params: {
            transaction: tx,
          },
        });
        return txSign;
      } else {
        return "failed to fetch accounts";
      }
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };
}

export default XrplRPC;
