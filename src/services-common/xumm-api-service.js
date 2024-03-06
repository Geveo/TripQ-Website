import {Xumm} from 'xumm'
import {LocalStorageKeys, PaymentResults} from "../constants/constants";
import {loginSuccessfully, logoutSuccessfully} from "../features/LoginState/LoginStateSlice";
import {store}  from '../app/store'

let xumm = null;

export async function xummAuthorize() {
    xumm = new Xumm(process.env.REACT_APP_XUMM_APIKEY);

    try {
        const res = await xumm.authorize();
        if(res && res.me) {
            localStorage.setItem(LocalStorageKeys.AccountAddress, res.me.account);
            store.dispatch(loginSuccessfully(res.me.account));
        }
    } catch (e) {
        console.log(e)
    }
}

export async function xummLogout() {
    localStorage.clear();
    store.dispatch(logoutSuccessfully())
    try {
        await xumm.logout()
    } catch (e) {
        console.log(e)
    }
}

export async function createPayloadAndSubmit(sourceAccount, destinationAccount, callback, amount, currency = null, issuer = null){
    let amountField = String(amount * 1000000);
    if(currency && issuer) {
        amountField = {
            value: String(amount),
            currency: currency,
            issuer: issuer
        }
    }

    const payload = await xumm.payload?.createAndSubscribe({
        TransactionType: 'Payment',
        Destination: destinationAccount,
        Account: sourceAccount,
        Amount: amountField,
    }, callback);

    return payload;
}


/**
 *
 * @param sourceAccount
 * @param destinationAccount
 * @param amount
 * @param currency
 * @param issuer
 * @returns {Promise<*>} Promise<CreatedPayload | null>
 *
 * Response looks like this
 *  {
 *   "uuid": "1289e9ae-7d5d-4d5f-b89c-18633112ce09",
 *   "next": {
 *     "always": "https://xumm.app/sign/1289e9ae-7d5d-4d5f-b89c-18633112ce09",
 *     "no_push_msg_received": "https://xumm.app/sign/1289e9ae-7d5d-4d5f-b89c-18633112ce09/qr"
 *   },
 *   "refs": {
 *     "qr_png": "https://xumm.app/sign/1289e9ae-7d5d-4d5f-b89c-18633112ce09_q.png",
 *     "qr_matrix": "https://xumm.app/sign/1289e9ae-7d5d-4d5f-b89c-18633112ce09_q.json",
 *     "qr_uri_quality_opts": ["m", "q", "h"],
 *     "websocket_status": "wss://xumm.app/sign/1289e9ae-7d5d-4d5f-b89c-18633112ce09"
 *   },
 *   "pushed": true
 * }
 */
export async function createPayload(sourceAccount, destinationAccount, amount, currency = null, issuer = null) {
    let amountField = String(amount * 1000000);
    if(currency && issuer) {
        amountField = {
            value: String(amount),
            currency: currency,
            issuer: issuer
        }
    }

    return await xumm.payload?.create({
        TransactionType: 'Payment',
        Destination: destinationAccount,
        Account: sourceAccount,
        Amount: amountField,
    })
}

export async function subscribe(createdPayload) {
    return await xumm.payload?.subscribe(createdPayload);
}

/**
 *  Use this method for Payments
 * @param sourceAddress
 * @param destinationAddress
 * @param amount
 * @param currency
 * @param issuer
 * @returns {Promise<constants.PaymentResults>}
 */
export async function showPayQRWindow(sourceAddress, destinationAddress, amount, currency, issuer) {
    const payload = await createPayload(sourceAddress, destinationAddress, amount, currency, issuer);
    const subscription = await subscribe(payload);

    const newWindow = window.open(payload.next.no_push_msg_received, 'Xaman Pay','height=750,width=600, right=300, resizable=no, left=300,top=100');
    const tmout = setInterval(() => {
        if(newWindow.closed){
            subscription.resolve(PaymentResults.ABORTED);
        }
    }, 1000)

    subscription.websocket.onmessage = (message) => {
        const data = JSON.parse(message.data.toString())
        if (Object.keys(data).indexOf('signed') > -1 && data.signed) {
            subscription.resolve(PaymentResults.COMPLETED);
            return data;
        } else if (Object.keys(data).indexOf('signed') > -1 && !data.signed) {
            subscription.resolve(PaymentResults.REJECTED);
            return data;
        }
    }

    const paymentResult = await subscription.resolved;
    clearInterval(tmout);
    newWindow.close();
    return paymentResult;
}

export function xummOff(event) {
    xumm.off(event)
}
