import { isCallbackUrlValid, areProvidersValid, validateProvidersData } from '../../webhooksApi/utils/validator';

describe('Given a list of providers and a callbackUrl string', () => {
    test('When validating providers list, Then return true for a valid Url and false otherwise', () => {
        const validateProviderOptions = [["gas"], ["internet"], ["gas", "internet"]];
        const invalidateProvider = ["cats"];

        for (const option of validateProviderOptions) {
            expect(areProvidersValid(option)).toBe(true);
        }
        expect(areProvidersValid(invalidateProvider)).toBe(false);
    });
    test('When validating callbackUrl, Then return true for a valid Url and false otherwise', () => {
        const validCallbackUrls = ['http://wonderbill.co.uk', 'http://localhost:4000/queue'];
        const invalidCallbackUrl = 'helloWorld';

        for (const url of validCallbackUrls) {
            expect(isCallbackUrlValid(url)).toBe(true);
        }
        expect(isCallbackUrlValid(invalidCallbackUrl)).toBe(false);
    });
    test('When validating providers and a callbackUrl string, Then return true if both are valid', () => {
        const validProviders = ["gas", "internet"];
        const validCallbackUrl = 'http://wonderbill.co.uk';
        const result = validateProvidersData(validProviders, validCallbackUrl);
        expect(result).toBe(true);
    });
    test('When validating providers and a callbackUrl string, Then return false if both are invalid', () => {
        const invalidProviders = ["cats", "internet"];
        const invalidCallbackUrl = 'invalidurl';
        const result = validateProvidersData(invalidProviders, invalidCallbackUrl);
        expect(result).toBe(false);
    });
    test('When validating providers and a callbackUrl string, Then return false if one is invalid', () => {
        const invalidProviders = ["invalid provider"];
        const invalidCallbackUrl = 'http://localhost:4000/queue';
        const result = validateProvidersData(invalidProviders, invalidCallbackUrl);
        expect(result).toBe(false);
    });
    test('When providers and callbackUrl are not provided, Then return false', () => {
        const invalidProviders = undefined;
        const invalidCallbackUrl = undefined;
        const result = validateProvidersData(invalidProviders, invalidCallbackUrl);
        expect(result).toBe(false);
    });
});
