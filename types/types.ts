import Bull from "bull";

export interface Bills {
    billedOn: string,
    amount: number
}

export interface Providers {
    [key: string]: Bills[] | undefined ,
    gas: Bills[],
    internet: Bills[]
}

export interface unverifiedProvidersData {
    providers?: string[];
    callbackUrl?: string;
}

export interface ProvidersData {
    providers: string[];
    callbackUrl: string;
}

export interface AddProvidersData {
    name: string;
    data: {
        provider: string,
        callbackUrl: string
    };
    opts: Bull.JobOptions
}

export interface CallbackData {
    gas?: Bills[];
    internet?: Bills[];
}

export interface JobData {
    provider: string;
    callbackUrl: string
}
