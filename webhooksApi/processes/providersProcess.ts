import { Job } from "bull";
import axios from 'axios';

import { CALLBACK_BASE_URL, PROVIDERS_BASE_URL } from '../../networkConfig';
import { Bills, CallbackData, JobData } from "../../types/types";

const MAX_PROVIDERS = 2;

const providersQueueProcess = async (job: Job<JobData>): Promise<Bills[]|unknown> => {
    console.log("Processing single job", job.data);
    console.log("attempts made:", job.attemptsMade);
    const providersDataForCallback: {[k: string]: Bills[]} = {};
    try {
        const {provider, data, status} = await getBillsFromProviders(job.data);
        console.log('result ', data);
        if(status === 200){
            providersDataForCallback[provider] = data;
            await sendBillsOfProvidersToCallbackUrl(providersDataForCallback)

            return Promise.resolve(data);
        }
    } catch (e) {
        if (job.attemptsMade >= 4) {
            notifySupport(job.id);
        }
        return Promise.reject(e)
    }
};

export const aggregatedProvidersDataForCallback: {
    [k: string]: Bills[]
} = {};

const providersBulkQueueProcess = async (job: Job<JobData>): Promise<Bills[]|unknown> => {
    console.log('bulk processorof job');
    console.log("attempts made: ", job.attemptsMade);
    try {
        const {provider, data, status} = await getBillsFromProviders(job.data);
        console.log('Bulk result ', data);

        if(status === 200){
            await aggregateAndSendProvidersData(provider, data);
            return Promise.resolve(data);
        }
    } catch (e) {
        if (job.attemptsMade >= 4) {
            notifySupport(job.id);
        }
        return Promise.reject(e)
    }
}

export const aggregateAndSendProvidersData = async (
    provider: string,
    data: Bills[]
): Promise<void> => {
    aggregatedProvidersDataForCallback[provider] = data;
    if (Object.keys(aggregatedProvidersDataForCallback).length === MAX_PROVIDERS) {
        await sendBillsOfProvidersToCallbackUrl(aggregatedProvidersDataForCallback)
    }
}

const sendBillsOfProvidersToCallbackUrl = async (payload: CallbackData) => {
    console.log('Calling callback url with: ', payload);
    try {
        await axios.post(`${CALLBACK_BASE_URL}/`, payload)
    } catch (e) {
        console.log('Error while sending data to callback url: ', e)
        throw(e);
    }
}

const getBillsFromProviders = async (jobData: JobData): Promise<{
    provider: string,
    data: Bills[],
    status: number
}> => {
    const { provider } = jobData;

    const {data, status} = await axios.get<Bills[]>(
        `${PROVIDERS_BASE_URL}/providers/${provider}`
    );
    return {provider, data, status};
}

export let SUPPORT_NOTIFIED = false

const notifySupport = (jobId: string|number) => {
    console.log(`COMPLETE FAILURE FOR JOB: ${jobId}`);
    SUPPORT_NOTIFIED = true
}

export { providersQueueProcess, providersBulkQueueProcess };
