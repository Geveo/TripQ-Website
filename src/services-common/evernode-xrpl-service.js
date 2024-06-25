import evernode from 'evernode-js-client'
import { add as txListenerAdd, remove as txListenerRemove, removeAll as txListenerRemoveAll }  from "../redux/transactionListener/transactionListenerSlice";
import { store } from '../redux/store';
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
        await Promise.all(clients.map(c => { c.unsubscribe(); return null; })); // Cleanup clients.
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
    store.dispatch(txListenerAdd({ key: accountAddress, value: [] }));

    try {
        console.log("Listening to the transactions of ", accountAddress)
        client.on(XRPLAccountEventTypes.PAYMENT, (tx, error) =>  {
            const listenedTransactions = store.getState().listenedTransactions;
            
            if(txFilter && txFilter.account) {
                if(tx.Account === txFilter.account) {
                    const tempArray = listenedTransactions.hasOwnProperty(accountAddress) && listenedTransactions[accountAddress].length > 0 ? [...listenedTransactions[accountAddress], tx] : [tx]
                    store.dispatch(txListenerAdd({ key: accountAddress, value: tempArray }));
                }
            } else {
                const tempArray = listenedTransactions.hasOwnProperty(accountAddress) && listenedTransactions[accountAddress].length > 0 ? [...listenedTransactions[accountAddress], tx] : [tx]
                store.dispatch(txListenerAdd({ key: accountAddress, value: tempArray }));
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
                    store.dispatch(txListenerRemove(accountAddress));
                } else {
                    c.off(XRPLAccountEventTypes.PAYMENT)
                    await c.unsubscribe();
                    store.dispatch(txListenerRemoveAll());
                }
            }

    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {*} accountAddress 
 * @param {*} currency 
 * @param {*} issuer 
 * @returns An array of trustline objects | Empty array if not
 */
export async function getTrustlines(accountAddress, currency, issuer) {

    const client = new evernode.XrplAccount(accountAddress, null , {xrplApi: xrplApi});
    clients.push(client)

    try {
        console.log("Getting trustlines of ", accountAddress);
        const trustlines = await client.getTrustLines(currency, issuer);
        return trustlines;

    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {*} accountAddress 
 * @returns An array of transaction objects
 */
export async function getTransactions(accountAddress) {
    const client = new evernode.XrplAccount(accountAddress, null , {xrplApi: xrplApi});
    clients.push(client)

    try {
        console.log("Getting transactions of ", accountAddress);
        const trxs = await client.getAccountTrx();
        return trxs;

    } catch (error) {
        throw error;
    }
}

export async function getAccountInfo(accountAddress) {
    const client = new evernode.XrplAccount(accountAddress, null , {xrplApi: xrplApi});
    clients.push(client)

    try {
        console.log("Getting account objects of ", accountAddress);
        const accInfo = await client.getInfo();
        return accInfo;

    } catch (error) {
        throw error;
    }
}