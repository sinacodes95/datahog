import Bull, {Job, Queue} from "bull";
import { AddProvidersData, ProvidersData } from "../../types/types";
import { providersQueueProcess, providersBulkQueueProcess } from "../processes/providersProcess";
import { bulkJobsDataParser, singleJobDataParser, BULK_QUEUE, SINGLE_QUEUE } from "../utils/jobsDataParser"

const REDIS_HOST = process.env.REDIS_URL || 'redis';

const providersQueue = new Bull('providers', REDIS_HOST);

providersQueue.process(SINGLE_QUEUE, providersQueueProcess)
providersQueue.process(BULK_QUEUE, providersBulkQueueProcess)

const providersJobProducer = async (
    {name, data, opts}: AddProvidersData,
    myProvidersQueue: Queue = providersQueue
): Promise<Job|void> => {
    try {
        console.log('Adding to single queue',)
        return await myProvidersQueue.add(name, data, opts)
    } catch (e) {
        console.log('Producer Error: ', e)
    }
}

const providersBulkJobProducer = async (
    data: AddProvidersData[],
    myProvidersQueue: Queue = providersQueue
): Promise<Job[]|void> => {
    try {
        console.log('Adding to bulk queue',)
        return await myProvidersQueue.addBulk(data);
    } catch (e) {
        console.log('Producer Error: ', e)
    }
}

const requestConsumer = async (jobData: ProvidersData): Promise<Job|Job[]|void> => {
    console.log('Request is being processed by consumer')
    if (jobData.providers.length > 1) {
        const jobsCollection = bulkJobsDataParser(jobData);
        return await providersBulkJobProducer(jobsCollection)
    } else {
        const singleJob = singleJobDataParser(jobData);
        return await providersJobProducer(singleJob)
    }
}

export {
    providersQueue,
    providersJobProducer,
    requestConsumer,
    ProvidersData,
    AddProvidersData
}
