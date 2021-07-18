import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const port = 5000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) =>  {
    res.send('Callback server');
});

app.post('/', (req: Request, res: Response) => {
  console.log(`Post request recieved by callback server!: `, req.body);
  res.status(200);
});

app.listen(port, () => console.log(`Callback server listening at http://localhost:${port}`));
