import fs from 'fs';
import path from 'path';

import ProcessService from '../service/ProcessService.js';
import Response from '../utils/Response.js';
import {GetMapping, PostMapping, WsGetMapping} from '../utils/ApiDecorator';

class ProcessController {

    @GetMapping({route: '/pm/processes'})
    static async getAll(ctx) {
        ctx.response.body = await ProcessService.getAll();
    }

    @WsGetMapping({route: '/pm/process/upload/:processName'})
    static async uploadProcess(ctx) {

        const processName = ctx.params.processName;
        if (!processName) {
            return ctx.websocket.send(Response.buildParamError('Process Name is required'));
        }

        ctx.websocket.on('message', message => {
            fs.writeFileSync(path.resolve(__dirname, `../../pm2-apps/${processName}.zip`), message);
            return ctx.websocket.send(Response.buildSuccess());
        });

    }

    // @PostMapping({route: '/pm/process/upload/:processName'})
    // static async uploadProcess(ctx) {
    //
    //     const processName = ctx.params.processName;
    //     if (!processName) {
    //         return ctx.response.body = Response.buildParamError('Process Name is required');
    //     }
    //
    //     console.log(ctx.request.body);
    //
    //     if (!ctx.request.body || !ctx.request.body.files || !ctx.request.body.files.file) {
    //         return ctx.response.body = Response.buildParamError('Process Package is required');
    //     }
    //
    //     ctx.response.body = await ProcessService.uploadProcess(processName, ctx.request.body.files.file);
    //
    // }

    @PostMapping({route: '/pm/process/start/:processId'})
    static async start(ctx) {

        const processId = ctx.params.processId;
        if (!processId) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ProcessService.start(processId);

    }

};

export default ProcessController;