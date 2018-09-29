import fs from 'fs';
import path from 'path';

import ProcessService from '../service/ProcessService.js';
import Response from '../utils/Response.js';
import {PostMapping, WsGetMapping} from '../utils/ApiDecorator';

class ProcessController {

    @WsGetMapping({route: '/pm/processes'})
    static async getProcesses(ctx) {
        ctx.websocket.on('message', () => {
            ProcessService.getProcesses().then(data => ctx.websocket.send(data));
        });
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

    @PostMapping({route: '/pm/process/start/:processName'})
    static async startByName(ctx) {

        const processName = ctx.params.processName;
        if (!processName) {
            return ctx.response.body = Response.buildParamError('Process Name is required');
        }

        ctx.response.body = await ProcessService.startByName(processName);

    }

};

export default ProcessController;
