/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Bull from "bull";
import { providersQueueProcess } from '../processes/providersProcess'

const providersQueue = new Bull('providers', {
    redis: process.env.REDIS_URL
});

// Producer
export const providersJobProducer = async (data: unknown): Promise<void> => {
    await providersQueue.add(data, {
        
    });
}

// Consumer
void providersQueue.process(providersQueueProcess);
