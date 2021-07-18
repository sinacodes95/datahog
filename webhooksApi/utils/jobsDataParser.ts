import { AddProvidersData, ProvidersData } from '../queues/providersQueue'
export const BULK_QUEUE = 'Bulk_Queue';
export const SINGLE_QUEUE = 'Single_Queue';

export const bulkJobsDataParser = (jobData: ProvidersData): AddProvidersData[]=> {
    const { providers, callbackUrl} = jobData;
    if (jobData.providers.length > 1) {
        return providers.map((provider) => {
            const providersData = {
                provider,
                callbackUrl
            }
            return { name: BULK_QUEUE, data: providersData, opts: {
                attempts: 5,
                backoff: 2000
                // delay: getDelay time for scheduled maintenance
            }};
        })
    } else {
        throw Error('Could Not Parse Bulk Data');
    }
}

export const singleJobDataParser = (jobData: ProvidersData): AddProvidersData => {
    const { providers, callbackUrl} = jobData;
    return { 
        name: SINGLE_QUEUE, data: {
            provider: providers[0],
            callbackUrl
        },
        opts: {
            attempts: 5,
            backoff: 2000
        }
    }
}
