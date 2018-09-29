import fs from 'fs';
import path from 'path';

import ProcessService from '../service/ProcessService.js';
import Response from '../utils/Response.js';
import {PutMapping, WsGetMapping, WsPostMapping} from '../utils/ApiDecorator';

class ProcessController {

    @WsGetMapping({route: '/pm/processes'})
    static async getProcesses(ctx) {
        ctx.websocket.on('message', () => {
            ProcessService.getProcesses().then(data => ctx.websocket.send(data));
        });
    }

    @WsPostMapping({route: '/pm/process/upload/:processName'})
    static async uploadProcess(ctx) {

        const processName = ctx.params.processName;
        if (processName == undefined) {
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

    @PutMapping({route: '/pm/process/start/:processName'})
    static async startByName(ctx) {

        const processName = ctx.params.processName;
        if (processName == undefined) {
            return ctx.response.body = Response.buildParamError('Process Name is required');
        }

        ctx.response.body = await ProcessService.startByName(processName);

    }

    @PutMapping({route: '/pm/process/pause/:processId'})
    static async pauseById(ctx) {

        const processId = ctx.params.processId;
        if (processId == undefined) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ProcessService.pauseById(processId);

    }

    @PutMapping({route: '/pm/process/pause'})
    static async pauseAll(ctx) {
        ctx.response.body = await ProcessService.pauseAll();
    }

    @PutMapping({route: '/pm/process/restart/:processId'})
    static async restartById(ctx) {

        const processId = ctx.params.processId;
        if (processId == undefined) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ProcessService.restartById(processId);

    }

    @PutMapping({route: '/pm/process/restart'})
    static async restartAll(ctx) {
        ctx.response.body = await ProcessService.restartAll();
    }

    @PutMapping({route: '/pm/process/stop/:processId'})
    static async stopById(ctx) {

        const processId = ctx.params.processId;
        if (processId == undefined) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ProcessService.stopById(processId);

    }

    @PutMapping({route: '/pm/process/stop'})
    static async stopAll(ctx) {
        ctx.response.body = await ProcessService.stopAll();
    }

    @PutMapping({route: '/pm/process/reload/:processId'})
    static async reloadById(ctx) {

        const processId = ctx.params.processId;
        if (processId == undefined) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ProcessService.reloadById(processId);

    }

    @PutMapping({route: '/pm/process/reload'})
    static async reloadAll(ctx) {
        ctx.response.body = await ProcessService.reloadAll();
    }

};

export default ProcessController;
