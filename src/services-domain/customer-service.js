import ContractService from "../services-common/contract-service";
import XrplService from "../services-common/xrpl-service";
import SharedStateService from "./sharedState-service";

const constants = require('../constants');


export default class CustomerService {
  static instance = CustomerService.instance || new CustomerService();

  contractService = ContractService.instance;
  #xrplService = XrplService.xrplInstance;


  /**
   * Get all the registered hotels
   * @returns A list of objects of hotels || null
   */
  async getAllHotels() {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_HOTELS,
      filters: {
        IsRegistered: 1
      }
    }
    try {
      const res = await this.contractService.submitReadRequest(submitObject);
      if(res.hotelList && res.hotelList.length > 0){
        return res.hotelList;
      } else {
        console.log("No hotels found.");
        return null;
      }
    }
    catch (error) {
      console.log(error);
      throw(error);
    }
  }

  async makeReservation(data) {

    const submitData =  {
      CustomerId: data.CustomerId,
      FromDate: data.FromDate,
      ToDate: data.ToDate,
      CustomerDetails: data.CustomerDetails,
      RoomSelections: data.roomSelections  //  [  {roomId: 1, roomCount: 3, costPerRoom: 25, roomName: "" }, {roomId: 2, roomCount: 3, costPerRoom: 25} ]
    }

    const submitObj = {
      type: constants.RequestTypes.RESERVATION,
      subType: constants.RequestSubTypes.CREATE_RESERVATION,
      data: data
    }
        let result;
        try {
            // {lastReservationId: 34}
            result = await this.contractService.submitInputToContract(submitObj);
            console.log("Result:",result);
        } catch (e) {
            console.log(e);
            throw e;
        }

        return result
    }
}

