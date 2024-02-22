import evernode from 'evernode-js-client'
import { add, remove, removeAll } from "../features/transactionListener/transactionListenerSlice";
import { store } from './../app/store'; 
const { XRPLAccountEventTypes } = require('./../constants/constants')


let xrplApi;
const clients = [];

export async function init() {
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

export async function deinit() {
    try{
        await Promise.all(clients.map(c => { c.unsubscribe(); })); // Cleanup clients.
        await xrplApi.disconnect();
    } catch (e) {
        console.log("Error occurred in disconnecting XRPL connection: ", e);
    }
}

/**
 * 
 * @param {*} accountAddress Address listened to
 * @param {*} txFilter {account: <transaction source address>} || null by default
 */
export async function listenToTransactionsByAddress(accountAddress, txFilter = null) {
    const client = new evernode.XrplAccount(accountAddress, null , {xrplApi: xrplApi});
    clients.push(client)
    store.dispatch(add({ key: accountAddress, value: [] }));

    try {
        console.log("Listening to the transactions of ", accountAddress)
        client.on(XRPLAccountEventTypes.PAYMENT, (tx, error) =>  {
            const listenedTransactions = store.getState().listenedTransactions;
            
            if(txFilter && txFilter.account) {
                if(tx.Account === txFilter.account) {
                    const tempArray = listenedTransactions.hasOwnProperty(accountAddress) && listenedTransactions[accountAddress].length > 0 ? [...listenedTransactions[accountAddress], tx] : [tx]
                    store.dispatch(add({ key: accountAddress, value: tempArray }));
                }
            } else {
                const tempArray = listenedTransactions.hasOwnProperty(accountAddress) && listenedTransactions[accountAddress].length > 0 ? [...listenedTransactions[accountAddress], tx] : [tx]
                store.dispatch(add({ key: accountAddress, value: tempArray }));
            }
        }); 

        await client.subscribe();

    } catch (error) {
        throw error;

    }
}

export async function stopListeningToTransactionsByAddress(accountAddress = null) {
    try {
            for(let c of clients) {
                if(accountAddress && c.address === accountAddress) {
                    console.log("Stop listening to transactions of ", accountAddress)
                    c.off(XRPLAccountEventTypes.PAYMENT)
                    await c.unsubscribe();
                    store.dispatch(remove(accountAddress));
                } else {
                    c.off(XRPLAccountEventTypes.PAYMENT)
                    await c.unsubscribe();
                    store.dispatch(removeAll());
                }
            }

    } catch (error) {
        throw error;
    }
}