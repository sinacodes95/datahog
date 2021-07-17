import { Job } from "bull";
import axios from 'axios';

import { PROVIDERS_BASE_URL } from '../../networkConfig';

const providersQueueProcess = async (job: Job) => {
    console.log("Processing fast", job.data);
    try {
        console.log("attempts made:", job.attemptsMade);
        const { providers, callbackUrl } = job.data;
        const {data, status} = await axios.get(`${PROVIDERS_BASE_URL}/providers/${providers[0]}`);
        console.log('result ', data);
        if(status === 200){
            return Promise.resolve(data);
        }
    } catch (e) {
        if (job.attemptsMade >= 2) {
            notifySupport(`COMPLETE FAILURE FOR JOB: ${job.id}`);
        }
        return Promise.reject(e)
    }
};

const notifySupport = (message: string) => {
    console.log(message);
}

export { providersQueueProcess};
