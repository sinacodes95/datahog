import express from 'express';
import type { Request, Response } from 'express';
import { validateProvidersData } from './utils/validator';
import { requestConsumer, ProvidersData } from './queues/providersQueue';
import { extractJobIds } from './utils/extractJobIds'
import { unverifiedProvidersData } from '../types/types';

const PORT = 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const queueRequestHandler = async (
    providers: string[]|undefined,
    callbackUrl: string|undefined,
    res: Response
) => {
    if(validateProvidersData(providers, callbackUrl)) {
        const data = { providers, callbackUrl } as ProvidersData
        console.log('-- Providers data validated --')
        res.status(200);
        const jobs = await requestConsumer(data)
        const jobIds = extractJobIds(jobs)
        
        res.send({status: 'Items queued', jobIds});
    } else {
        res.status(400);
        res.send({status: 'Invalid provider or callbackUrl'});
    }
}

app.post('/queue', async (
    req: Request,
    res: Response
) => {
    const { providers, callbackUrl } = req.body as unverifiedProvidersData;
    try {
        await queueRequestHandler(providers, callbackUrl, res)
    } catch(e) {
        console.log(e)
    }

});

app.listen(PORT, () => console.log(`Webhooks server listening at http://localhost:${PORT}`))
