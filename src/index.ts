import dotenv from 'dotenv'
import { useExpressServer } from 'routing-controllers';
import express, {Express} from 'express';
import bodyParser from "body-parser";
import httpContext from "express-http-context";
import mongoose from "mongoose";

import { AuthController } from './controllers/auth.controller';
import { PhotosController } from "./controllers/photos.controller";
import { AlbumController } from "./controllers/album.controller";

dotenv.config();
const port = process.env.SERVER_PORT || 5000;

const app: Express = express();

app.use(bodyParser.json());
app.use(httpContext.middleware);
useExpressServer(app, {
    controllers: [AuthController, PhotosController, AlbumController],
});

app.use((req, res) => {
    httpContext.ns.bindEmitter(req);
    httpContext.ns.bindEmitter(res);
});

try {
    mongoose.connect(process.env.MONGO_URI, {
    })
    app.listen(port, () => {
        console.log(`Running on port ${port}`);
    })
} catch (e) {
    console.log(e)
}