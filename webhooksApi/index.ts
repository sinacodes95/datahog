import express from 'express';
import type { Request, Response } from 'express';
import { validateProvidersData } from './utils/validator';
import { providersJobProducer, ProvidersData } from './queues/providersQueue';


const PORT = 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.post('/queue', async (req: Request, res: Response) => {
    const { providers, callbackUrl } = req.body as ProvidersData;
    try {
        if(validateProvidersData(providers, callbackUrl)) {
            res.status(200);
            await providersJobProducer({ providers, callbackUrl })
            res.send({status: 'Items queued'});
        } else {
            res.status(400);
            res.send({status: 'Invalid provider or callbackUrl'});
        }
    } catch(e) {
        console.log(e)
    }

});

app.listen(PORT, () => console.log(`Webhooks server listening at http://localhost:${PORT}`))
