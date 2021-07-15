import { Job } from "bull";

export const providersQueueProcess = (job: Job) => {
    console.log('queue processer: ', job)
};

