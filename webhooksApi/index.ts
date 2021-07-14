import express from 'express';
import type { Request, Response } from 'express';


const PORT = 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.post('/queue', (req: Request, res: Response) => {
    console.log('hello')
    res.send({ webhooks: 'ready!' })
});

app.listen(PORT, () => console.log(`Webhooks server listening at http://localhost:${PORT}`))
