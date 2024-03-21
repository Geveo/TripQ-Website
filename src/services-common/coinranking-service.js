const coinRankingAPIkey = process.env.REACT_APP_COINRANKING_APIKEY;
const XAH_UUID = process.env.REACT_APP_XAH_UUID;
const EVR_UUID = process.env.REACT_APP_EVR_UUID;


export default class CoinRankingService {

    static evrRate = 0;
    static xahRate = 0;



    static async getXAH2USDT(xah) {
        try{
            let rate = 0;
            if(CoinRankingService.xahRate > 0) {
                rate = CoinRankingService.xahRate;
            } else {
                const response = await fetch(`https://api.coinranking.com/v2/coin/${XAH_UUID}/price`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': coinRankingAPIkey
                    }
                })

                const resData = await response.json();
                if (resData.data) {
                    CoinRankingService.xahRate = Number(resData.data.price);
                    rate = Number(resData.data.price);

                } else {
                    rate = 1;
                }

            }

            return rate * xah;

        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    static async getEVR2USDT(evr) {
        try{
            let rate = 0;
            if(CoinRankingService.evrRate > 0) {
                rate = CoinRankingService.evrRate;
            } else {
                const response = await fetch(`https://api.coinranking.com/v2/coin/${EVR_UUID}/price`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': coinRankingAPIkey
                    }
                })

                const resData = await response.json();
                if (resData.data) {
                    CoinRankingService.evrRate = Number(resData.data.price);
                    rate = Number(resData.data.price);

                } else {
                    rate = 1;
                }

            }

            return rate * evr;

        } catch (e) {
            console.log(e);
            return 0;
        }
    }
}