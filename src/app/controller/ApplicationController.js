import fs from 'fs';
import path from 'path';

import ApplicationService from '../service/ApplicationService.js';
import Response from '../utils/Response.js';
import {PutMapping, WsPostMapping} from '../utils/ApiDecorator';

class ApplicationController {

    @WsPostMapping({route: '/pm/application/upload/:processName'})
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

    // @PostMapping({route: '/pm/application/upload/:processName'})
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
    //     ctx.response.body = await ApplicationService.uploadProcess(processName, ctx.request.body.files.file);
    //
    // }

    @PutMapping({route: '/pm/application/start/:processName'})
    static async startByName(ctx) {

        const processName = ctx.params.processName;
        if (processName == undefined) {
            return ctx.response.body = Response.buildParamError('Process Name is required');
        }

        ctx.response.body = await ApplicationService.startByName(processName);

    }

    @PutMapping({route: '/pm/application/pause/:processId'})
    static async pauseById(ctx) {

        const processId = ctx.params.processId;
        if (processId == undefined) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ApplicationService.pauseById(processId);

    }

    @PutMapping({route: '/pm/application/pause'})
    static async pauseAll(ctx) {
        ctx.response.body = await ApplicationService.pauseAll();
    }

    @PutMapping({route: '/pm/application/restart/:processId'})
    static async restartById(ctx) {

        const processId = ctx.params.processId;
        if (processId == undefined) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ApplicationService.restartById(processId);

    }

    @PutMapping({route: '/pm/application/restart'})
    static async restartAll(ctx) {
        ctx.response.body = await ApplicationService.restartAll();
    }

    @PutMapping({route: '/pm/application/stop/:processId'})
    static async stopById(ctx) {

        const processId = ctx.params.processId;
        if (processId == undefined) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ApplicationService.stopById(processId);

    }

    @PutMapping({route: '/pm/application/stop'})
    static async stopAll(ctx) {
        ctx.response.body = await ApplicationService.stopAll();
    }

    @PutMapping({route: '/pm/application/reload/:processId'})
    static async reloadById(ctx) {

        const processId = ctx.params.processId;
        if (processId == undefined) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ApplicationService.reloadById(processId);

    }

    @PutMapping({route: '/pm/application/reload'})
    static async reloadAll(ctx) {
        ctx.response.body = await ApplicationService.reloadAll();
    }

};

export default ApplicationController;
