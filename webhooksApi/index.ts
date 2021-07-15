import express from 'express';
import type { Request, Response } from 'express';
import { providersJobProducer } from './queues/providers.queue';

interface ProvidersData {
    providers?: Record<string, []>;
    callbackUrl?: string;
}

const PORT = 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.post('/queue', (req: Request, res: Response) => {
    const { providers, callbackUrl } = req.body as ProvidersData;
    console.log('hello')
    void providersJobProducer({providers, callbackUrl}).then(() => {
        res.send({webhooks: 'ok'});
    })
});

app.listen(PORT, () => console.log(`Webhooks server listening at http://localhost:${PORT}`))
