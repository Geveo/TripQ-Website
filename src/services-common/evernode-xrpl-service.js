const { XRPLAccountEventTypes } = require('./../constants/constants')
const evernode = require("evernode-js-client");

let xrplApi;
const clients = [];
const listenedTransactions = []; // Ex: [ 'accounAddress': [{Account, Amount, Destination}, {}, {}], 'accountAddres2': [{}, {},...]]

async function init() {
    console.log(process.env.REACT_APP_RIPPLED_SERVER)
    xrplApi = new evernode.XrplApi(process.env.REACT_APP_RIPPLED_SERVER, { autoReconnect: true });
    evernode.Defaults.set({
        xrplApi: xrplApi,
        useCentralizedRegistry: true,
        rippledServer: process.env.REACT_APP_RIPPLED_SERVER,
        networkID: process.env.REACT_APP_RIPPLE_NETWORK_ID
    });

    try {
        await xrplApi.connect();
    } catch(e) {
        console.log("Error occurred in initializing XRPL connection: ", e);
        throw e
    }
    
}


async function deinit() {
    try{
        await Promise.all(clients.map(c => { c.unsubscribe(); })); // Cleanup clients.

        // Added this timeout since some tests failed with not connected error.
        // await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for five seconds before disconnecting.
        await xrplApi.disconnect();
    } catch (e) {
        console.log("Error occurred in disconnecting XRPL connection: ", e);
    }
}

async function listenToTransactionsByAddress(accountAddress) {
    const client = new evernode.XrplAccount(accountAddress, null , {xrplApi: xrplApi});
    clients.push(client)
    listenedTransactions[accountAddress] = [];
    try {
        console.log("Listening to transactions of ", accountAddress)
        client.on(XRPLAccountEventTypes.PAYMENT, (tx, error) =>  {
            listenedTransactions[accountAddress].push(tx);
            console.log(listenedTransactions)
        }); 

        await client.subscribe();

    } catch (error) {
        throw error
        throw new Error("Transaction listerner failed unexpectedly.")

    }
}

async function stopListeningToTransactionsByAddress(accountAddress = null) {
    try {
            for(let c of clients) {
                if(accountAddress && c.address == accountAddress) {
                    console.log("Stop listening to transactions of ", accountAddress)
                    c.off(XRPLAccountEventTypes.PAYMENT)
                    await c.unsubscribe();
                    listenedTransactions[accountAddress] = [];
                } else {
                    c.off(evernode.XrplTransactionTypes.PAYMENT)
                    await c.unsubscribe();
                    listenedTransactions = [];
                }
            }

    } catch (error) {
        throw new Error("Transaction unsubscribing failed unexpectedly.")
    }
}

module.exports = {
    clients,
    deinit,
    init,
    listenToTransactionsByAddress,
    stopListeningToTransactionsByAddress,
    xrplApi,
    listenedTransactions
}