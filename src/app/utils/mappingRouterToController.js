import fs from 'fs';
import Router from 'koa-router';
import {REQUEST_METHOD, REQUEST_ROUTE} from './ApiDecorator';

const router = Router();

function mappingMethod(controller, method) {

    const requestMethod = method[REQUEST_METHOD],
        requestRoute = method[REQUEST_ROUTE];

    // add mapping route
    // console.log(`register URL mapping: ${requestMethod.toUpperCase()} ${requestRoute}`);
    router[requestMethod](requestRoute, method);

}

function mappingController(controller) {

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

        mappingMethod(controller, controller[methodName]);

    }

}

function mappingRouterToController(dir) {

    // traversal all controll file
    fs.readdirSync(dir + '/app/controller').forEach(file => {
        // console.log(`process controller: ${file}`);
        mappingController(require(dir + '/app/controller/' + file).default);
    });

    // traversal all model file
    fs.readdirSync(dir + '/app/model').forEach(file => {
        mappingModel(require(dir + '/app/model/' + file).default);
    });

    return router.routes();

};

export default mappingRouterToController;