import {Xumm} from 'xumm'
import {LocalStorageKeys} from "../constants/constants";
import {loginSuccessfully, logoutSuccessfully} from "../features/LoginState/LoginStateSlice";
import {store}  from '../app/store'

let xumm = null;
let payloadUrl = null;

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

export async function createPayload(sourceAccount, destinationAccount, callback, amount, currency = null, issuer = null){
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
