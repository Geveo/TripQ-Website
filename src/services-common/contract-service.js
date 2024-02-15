import { LocalStorageKeys } from "../constants/constants";

const nodeIp = process.env.REACT_APP_CONTRACT_NODE_IP;
const nodePort = process.env.REACT_APP_CONTRACT_NODE_PORT;
const HotPocket = window.HotPocket;
const rippleKeyPair = require("ripple-keypairs");

export default class ContractService {
  // Provide singleton instance
  static instance = ContractService.instance || new ContractService();

  userKeyPair = null;
  client = null;
  isConnectionSucceeded = false;
  server = `wss://${nodeIp}:${nodePort}`;

  isInitCalled = false;

  promiseMap = new Map();

  async init() {
    if (this.userKeyPair == null) {
      this.userKeyPair = await HotPocket.generateKeys();
    }
    if (this.client == null) {
      this.client = await HotPocket.createClient(
        [this.server],
        this.userKeyPair
      );
    }
    console.log("Initialized");

    // This will get fired if HP server disconnects unexpectedly.
    this.client.on(HotPocket.events.disconnect, () => {
      console.log("Disconnected");
      this.isConnectionSucceeded = false;
    });

    // This will get fired as servers connects/disconnects.
    this.client.on(HotPocket.events.connectionChange, (server, action) => {
      console.log(server + " " + action);
    });

    // This will get fired when contract sends outputs.
    this.client.on(HotPocket.events.contractOutput, (r) => {
      r.outputs.forEach((o) => {
        const pId = o.promiseId;
        if (o.error) {
          this.promiseMap.get(pId)?.rejecter(o.error);
        } else {
          this.promiseMap.get(pId)?.resolver(o.success);
        }

        this.promiseMap.delete(pId);
      });
    });

    this.client.on(HotPocket.events.healthEvent, (ev) => {
      console.log(ev);
    });

    if (!this.isConnectionSucceeded) {
      if (!(await this.client.connect())) {
        console.log("Connection failed.");
        return false;
      }
      console.log("HotPocket Connected.");
      this.isConnectionSucceeded = true;
    }
    this.isInitCalled = true;

    return true;
  }

  submitInputToContract(service, action, data) {
    let resolver, rejecter;
    const publicKey = localStorage.getItem(LocalStorageKeys.PublicKey);
    const privateKey = localStorage.getItem(LocalStorageKeys.PrivateKey);
    const accountAddress = localStorage.getItem(
      LocalStorageKeys.AccountAddress
    );

    const request = {
      Service: service,
      Action: action,
      requesterAddress: accountAddress,
      data,
    };

    const requestHex = this.#generateRequestHex(request);
    // Sign the message
    const signature = rippleKeyPair.sign(requestHex, privateKey);
    console.log("sIG " + signature);

    const req = {
      publicKey: publicKey,
      requestHex: requestHex,
      signature: signature,
    };
    const promiseId = this.#getUniqueId();
    const inpString = JSON.stringify({ id: promiseId, ...req });

    this.client.submitContractInput(inpString).then((input) => {
      input?.submissionStatus.then((s) => {
        if (s.status !== "accepted")
          throw Error(`Ledger_Rejection: ${s.reason}`);
      });
    });

    return new Promise((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
      this.promiseMap.set(promiseId, {
        resolver: resolver,
        rejecter: rejecter,
      });
    });
  }

  #getUniqueId() {
    const typedArray = new Uint8Array(10);
    const randomValues = window.crypto.getRandomValues(typedArray);
    return randomValues.join("");
  }

  #generateRequestHex(req) {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(req);

    // Convert the JSON string to a hex representation
    return Buffer.from(jsonString, "utf8").toString("hex");
  }

  async submitReadRequest(inp) {
    const inpString = JSON.stringify(inp);

    const output = await this.client.submitContractReadRequest(inpString);
    if (output.error) {
      throw output.error;
    } else {
      return output.success;
    }
  }
}
