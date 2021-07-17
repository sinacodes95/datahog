import axios from "axios";
import { CALLBACK_BASE_URL } from "../../networkConfig";

const MAX_PROVIDERS = 2;

export const aggregatedCallbackRequests = async (aggregatedProvidersData: unknown[]): Promise<void> => {
    if (aggregatedProvidersData.length === MAX_PROVIDERS) {
        console.log('Calling callback url with: ', aggregatedProvidersData);
        try {
            await axios.post(`${CALLBACK_BASE_URL}/`, aggregatedProvidersData)
        } catch (e) {
            console.log('Error while sending data to callback url: ', e)
        }
    }
}

