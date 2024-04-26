import ContractService from "../services-common/contract-service";
import XrplService from "../services-common/xrpl-service";
import SharedStateService from "./sharedState-service";

const constants = require("./../constants");
const contractWalletAddress = process.env.REACT_APP_CONTRACT_WALLET_ADDRESS;
const roomCreationCost = process.env.REACT_APP_ROOM_CREATION_COST;

export default class HotelService {
  static instance = HotelService.instance || new HotelService();

  #registrationURI = "SMBOOKING";

  contractService = ContractService.instance;
  #xrplService = XrplService.xrplInstance;

  async createNewHotelWallet() {
    const newHotelWallet = await this.#xrplService.createNewFundedUserWallet();
    SharedStateService.instance.hotelWallet = newHotelWallet;
    return newHotelWallet;
  }

  /**
   *
   * @param {string} seed
   * @returns | hotelWallet object || null
   */
  async generateHotelWallet(seed) {
    const hotelWallet = this.#xrplService.generateWalletFromSeed(seed);
    // Validate if a registered hotel
    const resObj = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.IS_REGISTERED_HOTEL,
      data: {
        HotelWalletAddress: hotelWallet.address,
      },
    };
    const res = await this.contractService.submitReadRequest(resObj);

    if (res && res.Id && res.Id > 0) {
      localStorage.setItem("seed", hotelWallet.seed);
      SharedStateService.instance.currentHotelId = res.Id;
      SharedStateService.instance.hotelWallet = hotelWallet;
      return res;
    } else {
      // if the hotel is not registered
      return null;
    }
  }

  /**
   *
   * @param {object} data | Object with hotel details
   * @returns true | false
   */
  async registerHotel(data) {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.REGISTER_HOTEL,
      data: data,
    };

    let result;
    try {
      result = await this.contractService.submitInputToContract(submitObject);

      SharedStateService.instance.currentHotelId = result.rowId.lastId;
    } catch (error) {
      console.log(error);
      throw error;
    }

    return result;
  }

  async createRoom(data) {
    const submitObject = {
      type: constants.RequestTypes.ROOM,
      subType: constants.RequestSubTypes.CREATE_ROOMTYPE,
      data: data,
    };
    let result;
    try {
      result = await this.contractService.submitInputToContract(submitObject);
    } catch (error) {
      console.log(error);
      throw error;
    }

    return result;
  }

  /**
   *
   * @param {object} resObject | {rowId, offerId}
   * @returns {hotelId: 1} | false
   */
  async #acceptHotelRegistrationOffer(resObject) {
    let result;
    try {
      result = await this.#xrplService.acceptNftOffer(
        SharedStateService.instance.hotelWallet.seed,
        resObject.offerId
      );
      if (result !== "tesSUCCESS")
        throw "Hotel Registration offer not accepted successfully.";

      const submitObject = {
        type: constants.RequestTypes.HOTEL,
        subType: constants.RequestSubTypes.REGISTRATION_CONFIRMATION,
        data: {
          hotelWalletAddress: SharedStateService.instance.hotelWallet.address,
          rowId: resObject.rowId,
        },
      };

      result = await this.contractService.submitInputToContract(submitObject);
    } catch (error) {
      throw error;
    }

    if (result.hotelId && result.hotelId > 0) return result;
    else return false;
  }

  /**
   *
   * @returns An hotel object || null
   */
  async getHotelById(id) {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_HOTEL_BY_ID,
      filters: {
        Id: id,
      },
    };
    try {
      const res = await this.contractService?.submitReadRequest(submitObject);
      if (res) {
        return res;
      } else {
        console.log("No hotel found.");
        return null;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRecentHotels() {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_RECENT_HOTEL,
      filters: {},
    };
    try {
      const res = await this.contractService?.submitReadRequest(submitObject);
      if (res) {
        return res;
      } else {
        console.log("No hotel found.");
        return null;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  /**
   *
   * @param {Object} filterObj
   * @returns An array of objects || []
   */
  async SearchHotelsWithRooms(filterObj) {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.SEARCH_HOTELS_WITH_ROOM,
      filters: filterObj,
    };
    let result;
    try {
      result = await this.contractService.submitReadRequest(submitObject);
        } catch (error) {
            console.log(error);
            throw (error);
        }
        return result;
  }

  /**
   *
   * @param {number} hotelId | Hotel Id
   * @returns | An array of rooms || []
   */
  async getHotelRoomTypes(hotelId) {
    const submitObject = {
      type: constants.RequestTypes.ROOM,
      subType: constants.RequestSubTypes.GET_ROOMS_BY_HOTELID,
      data: { HotelId: hotelId },
    };

    let result;
    try {
      result = await this.contractService.submitReadRequest(submitObject);
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result;
  }

  async getRoomTypeById(RTypeId) {
    const submitObject = {
      type: constants.RequestTypes.ROOM,
      subType: constants.RequestSubTypes.GET_ROOMTYPE_BY_ID,
      data: { RTypeId: RTypeId },
    };
    console.log(submitObject);
    let result;
    try {
      result = await this.contractService.submitReadRequest(submitObject);
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result;
  }

  async getSingleHotelWithRooms(hotelId, fromDateStr, toDateStr, roomCount) {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_SINGLE_HOTEL_WITH_ROOMS,
      filters: {
        HotelId: hotelId,
        CheckInDate: fromDateStr,
        CheckOutDate: toDateStr,
        RoomCount: roomCount,
      },
    };

    let result;
    try {
      result = await this.contractService.submitReadRequest(submitObject);
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result.searchResult;
  }

  /**
   *
   * @param {number} roomId |  roomId
   * @returns | A meessage string "Room deleted successfully."
   */
  async deleteMyRoom(roomId) {
    const submitObject = {
      type: constants.RequestTypes.ROOM,
      subType: constants.RequestSubTypes.DELETE_ROOM,
      data: { RoomId: roomId },
    };

    let result;
    try {
      result = await this.contractService.submitInputToContract(submitObject);
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result;
  }

  /**
   *
   * @param {number} hotelId
   * @param {object} data |
   * @returns A object { roomId: 2}
   */

  async makeReservation(data) {
    const submitData = {
      CustomerId: data.CustomerId,
      FromDate: data.FromDate,
      ToDate: data.ToDate,
      CustomerDetails: data.CustomerDetails,
      RoomSelections: data.roomSelections, //  [  {roomId: 1, roomCount: 3, costPerRoom: 25, roomName: "" }, {roomId: 2, roomCount: 3, costPerRoom: 25} ]
    };
    if (data.payNow) {
      const res = await this.#xrplService.makePayment(
        data.secret,
        data.totalFee.toString(),
        contractWalletAddress
      );
      if (res.meta.TransactionResult == "tesSUCCESS") {
        submitData.TransactionId = res.hash;
      }
    }

    const submitObj = {
      type: constants.RequestTypes.RESERVATION,
      subType: constants.RequestSubTypes.MAKE_RESERVATIONS,
      data: data,
    };

    let result;
    try {
      result = await this.contractService.submitInputToContract(submitObj);
    } catch (e) {
      console.log(e);
      throw e;
    }

    return result;
  }

  /**
   *
   * @param {Object} filterObj
   * @returns An array of objects || []
   */
  async getReservations(isCustomer, walletAddress) {
    const submitObject = {
      type: constants.RequestTypes.RESERVATION,
      subType: constants.RequestSubTypes.GET_RESERVATIONS,
      filters: {
        Filters: {
          walletAddress: walletAddress,
          isCustomer: isCustomer,
        },
      },
    };

    try {
      const res = await this.contractService.submitReadRequest(submitObject);
      if (res && res.reservationList && res.reservationList.length > 0) {
        return res.reservationList;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   *
   * @returns An hotel object || null
   */
  async getHotelsList(walletAddress) {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_HOTELS_BY_WALLET_ADDRESS,
      filters: {
        WalletAddress: walletAddress,
      },
    };
    try {
      const res = await this.contractService?.submitReadRequest(submitObject);
      if (res) {
        return res;
      } else {
        console.log("No hotel found.");
        return null;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   *
   * @returns hotel images || null
   */
  async getHotelImagesById(id) {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_HOTEL_IMAGES_BY_ID,
      filters: {
        Id: id,
      },
    };
    try {
      const res = await this.contractService?.submitReadRequest(submitObject);
      if (res && res.length > 0) {
        return res;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   *
   * @param {Object} filterObj
   * @returns An array of objects || []
   */
  async getAvailableRoomCount(hotelId, fromDate, toDate) {
    const submitObject = {
      type: constants.RequestTypes.ROOM,
      subType: constants.RequestSubTypes.GET_AVAILABLE_ROOM_COUNT,
      filter: {
        hotelId: hotelId,
        fromDate: new Date(fromDate).toISOString().split('T')[0],
        toDate: new Date(toDate).toISOString().split('T')[0],
      },
    };
    try {
      const res = await this.contractService?.submitReadRequest(submitObject);
      if (res) {
        return res;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   *
   * @param {Object} filterObj
   * @returns An array of objects || []
   */
  async GetHotelsListMappedWithAISearch(filterObj) {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_HOTELS_LIST_MAPPED_WITH_AI_SEARCH,
      filters: filterObj,
    };
    let result;
    try {
      result = await this.contractService.submitReadRequest(submitObject);
        } catch (error) {
            console.log(error);
            throw (error);
        }
        return result;
  }
}
