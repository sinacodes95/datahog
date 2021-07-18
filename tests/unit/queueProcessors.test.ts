import axios from 'axios';
import { Job } from 'bull';
import {  } from '../../networkConfig';
import { JobData } from '../../types/types';
import { aggregatedProvidersDataForCallback, providersBulkQueueProcess, providersQueueProcess, SUPPORT_NOTIFIED } from '../../webhooksApi/processes/providersProcess';
import { exampleSingleJob } from './fixtures/exampleJobs';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockImplementation(() => Promise.resolve());

describe('Given a queued job needs processing', () => {
    test('When a single job is added to queue, Then providersQueueProcess resolves the promise with retrieved data if status is 200', async () => {
        const bills = [
            { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
            { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
        ]
        mockedAxios.get.mockImplementation(() => Promise.resolve({data: bills, status: 200}));
        const processed = await providersQueueProcess(exampleSingleJob as unknown as Job<JobData>);

        expect(processed).toEqual(bills)
    });
    test('When a single job is added to queue, Then providersQueueProcess rejects the promise and calls notifySupport', async () => {
        let errorThrown = false;
        exampleSingleJob.attemptsMade = 4;
        mockedAxios.get.mockImplementation(() => Promise.reject());
        try {
            await providersQueueProcess(exampleSingleJob as unknown as Job<JobData>);
        } catch (e) {
            errorThrown = true
        }

        expect(errorThrown).toEqual(true);
        expect(SUPPORT_NOTIFIED).toEqual(true);
    })
});

describe('Given a queued bulk of job need processing', () => {
    test('When the first job is being processed, Then resolves the promise with retrieved the data if status is 200 and job is added to aggregate', async () => {
        const bills = [
            { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
            { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
        ]
        mockedAxios.get.mockImplementation(() => Promise.resolve({data: bills, status: 200}));
        const processed = await providersBulkQueueProcess(exampleSingleJob as unknown as Job<JobData>);

        expect(processed).toEqual(bills)
        expect(Object.values(aggregatedProvidersDataForCallback).length).toBe(1)
    });
    test('When a single job is added to queue, Then providersQueueProcess rejects the promise and calls notifySupport', async () => {
        let errorThrown = false;
        exampleSingleJob.attemptsMade = 4;
        mockedAxios.get.mockImplementation(() => Promise.reject());
        try {
            await providersBulkQueueProcess(exampleSingleJob as unknown as Job<JobData>);
        } catch (e) {
            errorThrown = true
        }

        expect(errorThrown).toEqual(true);
        expect(SUPPORT_NOTIFIED).toEqual(true);
    })
});
