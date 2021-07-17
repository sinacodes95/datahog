import { bulkJobsDataParser } from '../../webhooksApi/utils/bulkJobsDataParser'

describe('Given a bulk request is made', () => {
    const exampleProvidersData = {
        providers: ['gas', 'internet'],
        callbackUrl: 'http:helloWorld.com'
    }
    test('When bulkJobsDataParser is invoked, Then an array of "add queue" objects are returned', () => {
        const actualResult = bulkJobsDataParser(exampleProvidersData);
        const expectedResult = [
            { 
                name: 'Bulk_Queue',
                data: {
                    provider: 'gas',
                    callbackUrl: 'http:helloWorld.com'
                },
                opts: {
                    attempts: 3,
                    backoff: 2000
                }
            },
            { 
                name: 'Bulk_Queue',
                data: {
                    provider: 'internet',
                    callbackUrl: 'http:helloWorld.com'
                    },
                opts: {
                    attempts: 3,
                    backoff: 2000
                }
            }
        ]
        expect(actualResult[0].data.provider).toEqual(expectedResult[0].data.provider);
        expect(actualResult[1].data.provider).toEqual(expectedResult[1].data.provider);
    });
})
