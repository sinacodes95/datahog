import { Job } from "bull";
import axios from 'axios';

import { PROVIDERS_BASE_URL } from '../../networkConfig';
import { Bills, CallbackData, JobData } from "../../types/types";

const MAX_PROVIDERS = 2;

const providersQueueProcess = async (job: Job<JobData>): Promise<Bills[]|unknown> => {
    console.log("Processing a single job with job data: ", job.data);
    console.log("Attempts made at processing job:", job.attemptsMade +1);
    const providersDataForCallback: {[k: string]: Bills[]} = {};
    try {
        const {provider, callbackUrl, data, status} = await getBillsFromProviders(job.data);
        console.log(`Data retrieved from Provider source after ${job.attemptsMade +1} attemps: `, data);
        if(status === 200){
            providersDataForCallback[provider] = data;
            await sendBillsOfProvidersToCallbackUrl(providersDataForCallback, callbackUrl);
            aggregatedProvidersDataForCallback = {}
            return Promise.resolve(data);
        }
        return Promise.reject();
    } catch (e) {
        if (job.attemptsMade >= 4) {
            notifySupport(job.id);
        }
        return Promise.reject(e)
    }
};

export let aggregatedProvidersDataForCallback: {
    [k: string]: Bills[]
} = {};

const providersBulkQueueProcess = async (job: Job<JobData>): Promise<Bills[]|unknown> => {
    console.log('Processing a bulk of jobs');
    console.log("Attempts made at processing each job:", job.attemptsMade +1);
    try {
        const {provider, callbackUrl, data, status} = await getBillsFromProviders(job.data);
        console.log(`Data retrieved from Provider source after ${job.attemptsMade +1} attemps: `, data);

        if(status === 200){
            await aggregateAndSendProvidersData(provider, callbackUrl, data);
            return Promise.resolve(data);
        }
        return Promise.reject();
    } catch (e) {
        if (job.attemptsMade >= 4) {
            notifySupport(job.id);
        }
        return Promise.reject(e)
    }
}

export const aggregateAndSendProvidersData = async (
    provider: string,
    callbackUrl: string,
    data: Bills[]
): Promise<void> => {
    aggregatedProvidersDataForCallback[provider] = data;
    if (Object.keys(aggregatedProvidersDataForCallback).length === MAX_PROVIDERS) {
        await sendBillsOfProvidersToCallbackUrl(aggregatedProvidersDataForCallback, callbackUrl);
        aggregatedProvidersDataForCallback = {}

    }
}

const sendBillsOfProvidersToCallbackUrl = async (payload: CallbackData, callbackUrl: string) => {
    console.log('Sending retrieved data to callbackUrl provided',);
    try {
        return await axios.post(`${callbackUrl}/`, payload)
    } catch (e) {
        console.log('Error while sending data to callback url: ', e)
        throw(e);
    }
}

const getBillsFromProviders = async (jobData: JobData): Promise<{
    provider: string,
    callbackUrl: string
    data: Bills[],
    status: number
}> => {
    const { provider, callbackUrl } = jobData;

    const {data, status} = await axios.get<Bills[]>(
        `${PROVIDERS_BASE_URL}/providers/${provider}`
    );
    return {provider, callbackUrl, data, status};
}

export let SUPPORT_NOTIFIED = false

const notifySupport = (jobId: string|number) => {
    console.log(`COMPLETE FAILURE FOR JOB: ${jobId}`);
    SUPPORT_NOTIFIED = true;
}

export { providersQueueProcess, providersBulkQueueProcess };
