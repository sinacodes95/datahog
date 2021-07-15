export const validateProvidersData = (
    providers?: string[],
    callbackUrl?: string
): boolean => {
    if (providers && callbackUrl) {
        return areProvidersValid(providers) && isCallbackUrlValid(callbackUrl);
    }
    return false;
};

export const isCallbackUrlValid = (
    callbackUrl: string
): boolean => {
    return (/^https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/).test(callbackUrl);
}

export const areProvidersValid = (
    providers: string[]
): boolean => {
    const validProviders = ["gas", "internet"];
    for (const provider of providers) {
        if (!validProviders.includes(provider)) {
            return false;
        }
    }
    return true
}
