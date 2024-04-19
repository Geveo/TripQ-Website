import { OpenAIClient } from "@azure/openai";
import { AzureKeyCredential } from "@azure/core-auth";

export class AzureOpenaiService {
    static instance = null;

    endpoint = process.env.REACT_APP_AZ_OPENAI_ENDPOINT;
    credential = new AzureKeyCredential(process.env.REACT_APP_AZ_OPENAI_API_KEY);
    client = new OpenAIClient(this.endpoint, this.credential);
    modelInstanceName = process.env.REACT_APP_AZ_OPENAI_MODEL_NAME;


    static getInstance() {
        if(!AzureOpenaiService.instance) {
            AzureOpenaiService.instance = new AzureOpenaiService();
        }

        return AzureOpenaiService.instance;
    }

    cleanJsonInput(jsonString) {
        return jsonString.replace(/```json|```|```js/g, '').trim();
    }
    stringToArray(inputString) {
        try {
            const array = JSON.parse(inputString);
            if (!Array.isArray(array)) {
                throw new Error('Input is not a valid JSON array.');
            }
            return array;
        } catch (error) {
            console.error('Error parsing the input string:', error.message);
            return [];
        }
    }

    async searchHotels(message, count = 25) {
        message += `Give me the reply in English with ${count} hotels as an array of strings of hotel names, only.`
        console.log(message)
        const reply = await this.client.getChatCompletions(
            this.modelInstanceName, // assumes a matching model deployment or model name
            [{role: "user", content: message}]
        );

        // console.log(reply.choices[0].message.content)

        return JSON.parse(this.cleanJsonInput(reply.choices[0].message.content));
    }

}