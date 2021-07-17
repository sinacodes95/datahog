import { Job } from "bull";
import axios, { AxiosResponse } from 'axios';

import { PROVIDERS_BASE_URL } from '../../networkConfig';
import { aggregatedCallbackRequests } from "../utils/aggregateCallbackRequests";

interface Bills {
    billedOn: string,
    amount: number
}

interface jobData {
    provider: string;
    callbackUrl: string
}

const providersQueueProcess = async (job: Job): Promise<unknown> => {
    console.log("Processing fast", job.data);
    try {
        console.log("attempts made:", job.attemptsMade);
        const { provider, callbackUrl } = job.data as jobData;

        const {data, status} = await axios.get<AxiosResponse>(
            `${PROVIDERS_BASE_URL}/providers/${provider}`
        );
        console.log('result ', data);
        if(status === 200){
            // call callbackUrl
            return Promise.resolve(data);
        }
    } catch (e) {
        if (job.attemptsMade >= 2) {
            notifySupport(job.id);
        }
        return Promise.reject(e)
    }
};

const providersBulkQueueProcess = async (job: Job): Promise<unknown> => {
    console.log("attempts made: ", job.attemptsMade);
    const aggregatedProvidersData = [];
    try {
        console.log('bulk processorof job: ', job);
        const { provider, callbackUrl } = job.data as jobData;

        const {data, status} = await axios.get<AxiosResponse>(
            `${PROVIDERS_BASE_URL}/providers/${provider}`
        );
        console.log('Bulk result ', data);
        if(status === 200){

            aggregatedProvidersData.push(data);
            await aggregatedCallbackRequests(aggregatedProvidersData)

            return Promise.resolve(data);
        }
    } catch (e) {
        if (job.attemptsMade >= 2) {
            notifySupport(job.id);
        }
        return Promise.reject(e)
    }

}


const notifySupport = (jobId: string|number) => {
    console.log(`COMPLETE FAILURE FOR JOB: ${jobId}`);
}

export { providersQueueProcess, providersBulkQueueProcess };
