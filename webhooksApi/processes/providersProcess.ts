import { Job } from "bull";

const providersQueueProcess = async (job: Job) => {
    console.log("Message sent: %s");
};

export default providersQueueProcess;
