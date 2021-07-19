import express from 'express';
import type { Request, Response } from 'express';
import { Providers } from '../types/types';

const VIRTUAL_DATABASE: Providers[] = [];

const app = express();
const port = 5000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) =>  {
    if (!VIRTUAL_DATABASE.length) return res.status(404).end();
	res.status(200);
    res.send(VIRTUAL_DATABASE);
});

app.post('/', (req: Request, res: Response) => {
	console.log(`Post request recieved by callback server!: `, req.body);
	VIRTUAL_DATABASE.push(req.body);
	res.status(200).end();
});

app.listen(port, () => console.log(`Callback server listening at http://localhost:${port}`));
