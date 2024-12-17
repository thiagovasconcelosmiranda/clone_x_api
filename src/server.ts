import express from 'express';
import cors from 'cors';
import { router } from './routers/router';

const app = express();
const port = process.env.PORT ?? 4000;
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(router);

app.listen(port, () => console.log(`Server http://localhost:${port}`));