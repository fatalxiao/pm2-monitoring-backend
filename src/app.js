import Koa from 'koa';
import cors from '@koa/cors';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import websockify from 'koa-websocket';

import {mappingRouterToController, mappingWebsocketRouterToController} from './app/utils/mappingRouterToController.js';
import config from './config.js';

const app = websockify(new Koa());

app
.use(cors())
.use(serve('.'))
.use(bodyParser())
.use(mappingRouterToController(__dirname));

app.ws.use(mappingWebsocketRouterToController(__dirname));

app.listen(config.port, error => {

    if (error) {
        console.log(error);
        return;
    }

    console.log(`Server started and listen on port ${config.port}`);

});