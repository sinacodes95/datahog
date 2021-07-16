import Bull, {Job} from "bull";
import providersQueueProcess from "../processes/providersProcess";

const REDIS_HOST = process.env.REDIS_URL || 'redis';

export interface ProvidersData {
    providers?: string[];
    callbackUrl?: string;
}

const providersQueue = new Bull('providers', REDIS_HOST);

providersQueue.process(providersQueueProcess)

export const providersJobProducer = async (data: ProvidersData): Promise<Job|void> => {
    try {
        console.log('Adding to queue',)
        return await providersQueue.add(data, {
            attempts: 3,
            backoff: 5000
        });
    } catch (e) {
        console.log('Producer Error: ', e)
    }
}
