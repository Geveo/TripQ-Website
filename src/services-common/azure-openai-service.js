import { OpenAIClient } from "@azure/openai";
import { AzureKeyCredential } from "@azure/core-auth";

export class AzureOpenaiService {
  static instance = null;

  endpoint = process.env.REACT_APP_AZ_OPENAI_ENDPOINT;
  credential = new AzureKeyCredential(process.env.REACT_APP_AZ_OPENAI_API_KEY);
  client = new OpenAIClient(this.endpoint, this.credential);
  modelInstanceName = process.env.REACT_APP_AZ_OPENAI_MODEL_NAME;

  static getInstance() {
    if (!AzureOpenaiService.instance) {
      AzureOpenaiService.instance = new AzureOpenaiService();
    }

    return AzureOpenaiService.instance;
  }

  cleanJsonInput(jsonString) {
    return jsonString.replace(/```json|```|```js/g, "").trim();
  }

  stringToArray(inputString) {
    try {
      const array = JSON.parse(inputString);
      if (!Array.isArray(array)) {
        throw new Error("Input is not a valid JSON array.");
      }
      return array;
    } catch (error) {
      console.error("Error parsing the input string:", error.message);
      return [];
    }
  }

  /**
   *
   * @param destination
   * @param facilities
   * @param count
   * @returns {Promise<any>}
   */
  async searchHotels(destination, facilities, count = 5) {
    let searchText = `Give me ${count} hotels in ${destination}`;
  
    if (facilities.length > 0) {
      searchText += ` with `;
      facilities.forEach((facility, index) => {
        searchText += facility;
        if (index !== facilities.length - 1) {
          searchText += ", ";
        }
      });
    }
    
    searchText += `. Give me only a json output(english) in the following format.  { hotels: [hotel_name: ""]} `;
  
    console.log(searchText)
    const reply = await this.client.getChatCompletions(
      this.modelInstanceName,
      [{ role: "user", content: searchText }]
    );
  
    return JSON.parse(this.cleanJsonInput(reply.choices[0].message.content));
  }

  /**
   *
   * @param hotelName
   * @param destination
   * @returns {Promise<any>}
   */
  async getHotelDetails(hotelName, destination) {
    let message = `${hotelName}, ${destination}. Give me only a json output in the following format.  { hotel_name: ${hotelName}, hotel_description: "", hotel_address: "", website_link: "", star_ratings: 0, phone: ""} where hotel_description is a description about the hotel, hotel_address is the hotel address and website_link is the website URL of hotel. hotel_name should be same as ${hotelName}`;
    //console.log(message);
    const reply = await this.client.getChatCompletions(
      this.modelInstanceName, // assumes a matching model deployment or model name
      [{ role: "user", content: message }]
    );

    return JSON.parse(this.cleanJsonInput(reply.choices[0].message.content));
  }

  /**
   *
   * @param facilitiesText
   * @returns {Promise<any>}
   */
  async getHotelFacilities(facilitiesText) {
    let message = `Extract valid hotel facilities from this user input only as a json output in the following format. { hotelFacilities: [""]}. User input -: ${facilitiesText}. `;
    const reply = await this.client.getChatCompletions(this.modelInstanceName, [
      { role: "user", content: message },
    ]);
    return JSON.parse(this.cleanJsonInput(reply.choices[0].message.content));
  }

  /**
   *
   * @param message
   * @returns {Promise<any>}
   */
  async getSearchParameters(message) {
    const currentYear = new Date().getFullYear();
    message += `. Give me only a json output in the following format.  { destination: "", from_date: "", to_date: "", total_head_count: 1, facilities: []} , where destination is a string extracted from the description(check for correct location name) or null, to_date and from_date are also extracted from description. If the year is not specified in the description, it should be ${currentYear}, formatted as dd/mm/yyyy or null. total_head_count is an integer value extracted, if not found its value is 1. facilities should be extracted from description. Language must be english.`;
    console.log(message);
    const reply = await this.client.getChatCompletions(
      this.modelInstanceName, // assumes a matching model deployment or model name
      [{ role: "user", content: message }]
    );

    return JSON.parse(this.cleanJsonInput(reply.choices[0].message.content));
  }
}
