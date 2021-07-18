import axios from 'axios';
import { CALLBACK_BASE_URL } from '../../networkConfig';
import { aggregateAndSendProvidersData, aggregatedProvidersDataForCallback } from '../../webhooksApi/processes/providersProcess';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockImplementation(() => Promise.resolve());

describe('Given a bulk of data jobs has been queued', () => {
    test('When ONE of the bulk data jobs has been fulfilled, Then it will be added to aggregatedProvidersDataForCallback', async () => {
        const exampleBills = [
            { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
            { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
        ];
        await aggregateAndSendProvidersData('gas', CALLBACK_BASE_URL, exampleBills); 

        expect(aggregatedProvidersDataForCallback).toHaveProperty('gas')
    });
    test('When ONE of the bulk data jobs has been fulfilled, Then the axios request to callbackUrl is not made', async () => {
        const exampleBills = [
            { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
            { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
        ];
        await aggregateAndSendProvidersData('gas', CALLBACK_BASE_URL, exampleBills); 

        expect(mockedAxios.post).not.toHaveBeenCalled();
    });
    test('When ALL of the bulk data jobs have been fulfilled, Then the axios request to callbackUrl is made', async () => {
        const exampleBills = [
            { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
            { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
        ];
        await aggregateAndSendProvidersData('gas', CALLBACK_BASE_URL, exampleBills);
        await aggregateAndSendProvidersData('internet', CALLBACK_BASE_URL, exampleBills);

        expect(mockedAxios.post).toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith(`${CALLBACK_BASE_URL}/`, {
            gas: [
                { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
                { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
            ],
            internet: [
                { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
                { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
            ]
        });
    });
    test('When the axios request to callbackUrl is made and there is an error, Then the error will be thrown', async () => {
        const exampleBills = [
            { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
            { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
        ];
        mockedAxios.post.mockImplementation(() => Promise.reject());
        let errorThrown = false;
        try {
            await aggregateAndSendProvidersData('gas', CALLBACK_BASE_URL, exampleBills);
            await aggregateAndSendProvidersData('internet', CALLBACK_BASE_URL, exampleBills);
        } catch (e) {
            errorThrown = true;
        }

        expect(mockedAxios.post).toHaveBeenCalled();
        expect(errorThrown).toBeTruthy();
    });
})
