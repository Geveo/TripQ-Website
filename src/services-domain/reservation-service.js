import ContractService from "../services-common/contract-service";

const constants = require('../constants');


export default  class ReservationService {
    contractService = ContractService.instance;

    async getReservations(id = 0, walletAddress = null, hotelId = 0, date = null ) {
        const filterObj = {};
        if(id > 0) {
            filterObj.Id = id;
        }
        if(walletAddress && walletAddress.length > 10) {
            filterObj.WalletAddress = walletAddress;
        }
        if(hotelId > 0) {
            filterObj.HotelId = hotelId;
        }
        if(date) {
            filterObj.date = date;
        }


        const submitObject = {
            type: constants.RequestTypes.RESERVATION,
            subType: constants.RequestSubTypes.GET_RESERVATIONS,
            data: {filters: filterObj}
        }
        try {
            const res = await this.contractService.submitReadRequest(submitObject);
            return res;
        }
        catch (error) {
            console.log(error);
            throw(error);
        }
    }
}

