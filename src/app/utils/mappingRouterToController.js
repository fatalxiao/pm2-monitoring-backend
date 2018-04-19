import fs from 'fs';
import Router from 'koa-router';
import {REQUEST_METHOD, REQUEST_ROUTE} from './ApiDecorator';

const router = Router();

function mappingMethod(controller, method, isWebsocket) {

    const requestProtocol = method[REQUEST_PROTOCOL],
        requestMethod = method[REQUEST_METHOD],
        requestRoute = method[REQUEST_ROUTE];

    // add mapping route
    // console.log(`register URL mapping: ${requestMethod.toUpperCase()} ${requestRoute}`);
    router[requestMethod](requestRoute, method);

}

function mappingController(controller, isWebsocket) {

    if (!controller) {
        return;
    }

    // traversal all rest class methods
    for (let methodName of Object.getOwnPropertyNames(controller)) {

        if (!methodName || !controller[methodName]
            || !controller[methodName][REQUEST_METHOD]
            || !controller[methodName][REQUEST_ROUTE]) {
            continue;
        }

        mappingMethod(controller, controller[methodName], isWebsocket);

    }

}

function mappingRouterToController(dir, isWebsocket) {

    // traversal all controll file
    fs.readdirSync(dir + '/app/controller').forEach(file => {
        // console.log(`process controller: ${file}`);
        mappingController(require(dir + '/app/controller/' + file).default, isWebsocket);
    });

    return router.routes();

};

export default mappingRouterToController;