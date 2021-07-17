import Bull from 'bull';
import { extractJobIds } from '../../webhooksApi/utils/extractJobIds'
import { exampleSingleJob } from './fixtures/exampleJobs';

describe('Given that adding to the queue was success', () => {
    test('When a single job is returned, Then the Id is extracted', () => {
        const actualResult = extractJobIds(exampleSingleJob as unknown as Bull.Job);
        expect(actualResult).toEqual('1');
    });
    test('When no job is returned, Then empty array is returned', () => {
        const actualResult = extractJobIds(undefined);
        const actualResultNull = extractJobIds(null);
        expect(actualResult).toEqual([]);
        expect(actualResultNull).toEqual([]);
    });
})
