import Bull, {Job, Queue} from "bull";
import { providersQueueProcess } from "../processes/providersProcess";
import { bulkJobsDataParser } from "../utils/bulkJobsDataParser"

const REDIS_HOST = process.env.REDIS_URL || 'redis';
const SINGLE_QUEUE = 'Single_Queue';

interface ProvidersData {
    providers?: string[];
    callbackUrl?: string;
}

interface BulkProvidersData {
    name?: string;
    data: {
        provider: string,
        callbackUrl: string
    };
    opts?: Bull.JobOptions
}

const providersQueue = new Bull('providers', REDIS_HOST);

providersQueue.process(providersQueueProcess)

const providersJobProducer = async (
    data: ProvidersData,
    myProvidersQueue: Queue = providersQueue
): Promise<Job|void> => {
    try {
        console.log('Adding to fast queue',)
        return await myProvidersQueue.add(SINGLE_QUEUE, data, {
            attempts: 3,
            backoff: 2000
            // delay: getDelay time for scheduled maintenance
        });
    } catch (e) {
        console.log('Producer Error: ', e)
    }
}

const providersBulkJobProducer = async (
    data: BulkProvidersData[],
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
    console.log('consumer')
    if (jobData.providers && jobData.providers.length > 1) {
        const jobsCollection = bulkJobsDataParser(jobData);
        return await providersBulkJobProducer(jobsCollection)
    } else {
        return await providersJobProducer(jobData)
    }
}

export {
    providersQueue,
    providersJobProducer,
    requestConsumer,
    ProvidersData,
    BulkProvidersData
}
