import express from 'express';
import cors from 'cors';
import { router } from './routers/router';
import fileUpload from "express-fileupload";
import path from 'path';

const app = express();
const port = process.env.PORT ?? 4000;
app.use(fileUpload());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);
app.listen(port, () => console.log(`Server http://localhost:${port}`));
console.log(path.join(__dirname, '../public'))