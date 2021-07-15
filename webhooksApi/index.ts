import express from 'express';
import type { Request, Response } from 'express';
import { providersJobProducer } from './queues/providers.queue';


const PORT = 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

interface ProvidersData {
    providers?: Record<string, []>;
    callbackUrl?: string;
}

app.post('/queue', (req: Request, res: Response) => {
    const { providers, callbackUrl } = req.body as ProvidersData;
    console.log(providers, callbackUrl)
    void providersJobProducer({providers, callbackUrl}).then(() => {
        res.send({webhooks: 'ok'});
    })
});

app.listen(PORT, () => console.log(`Webhooks server listening at http://localhost:${PORT}`))
