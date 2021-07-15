import express from 'express';
import type { Request, Response } from 'express';
import { providersJobProducer } from './queues/providersQueue';
import { validateProvidersData } from './utils/validator';


const PORT = 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

interface ProvidersData {
    providers?: string[];
    callbackUrl?: string;
}

app.post('/queue', (req: Request, res: Response) => {
    const { providers, callbackUrl } = req.body as ProvidersData;

    if(validateProvidersData(providers, callbackUrl)) {
        void providersJobProducer({providers, callbackUrl}).then(() => {
            res.status(200);
            res.send({status: 'Items queued'});
        })
    } else {
        res.status(400);
        res.send({status: 'Invalid provider or callbackUrl'});
    }

});

app.listen(PORT, () => console.log(`Webhooks server listening at http://localhost:${PORT}`))
