import { BulkProvidersData, ProvidersData } from '../queues/providersQueue'
const BULK_QUEUE = 'Bulk_Queue';

export const bulkJobsDataParser = (jobData: ProvidersData): BulkProvidersData[] => {
    if (jobData.providers && jobData.callbackUrl) {
        const { providers, callbackUrl} = jobData;
        return providers.map((provider) => {
            const providersData = {
                provider,
                callbackUrl
            }
            return { name: BULK_QUEUE, data: providersData, opts: {
                attempts: 3,
                backoff: 2000
                // delay: getDelay time for scheduled maintenance
            }};
        })
    } else {
        throw Error('Could Not Parse Bulk Data');
    }
}
