import fs from 'fs';
import path from 'path';

import ApplicationService from '../service/ApplicationService.js';
import Response from '../utils/Response.js';
import {PutMapping, WsPostMapping} from '../utils/ApiDecorator';

class ApplicationController {

    @WsPostMapping({route: '/pm/application/upload/:applicationName'})
    static async uploadApplication(ctx) {

        const applicationName = ctx.params.applicationName;
        if (applicationName == undefined) {
            return ctx.websocket.send(Response.buildParamError('Application Name is required'));
        }

        ctx.websocket.on('message', message => {
            fs.writeFileSync(path.resolve(__dirname, `../../pm2-apps/${applicationName}.zip`), message);
            return ctx.websocket.send(Response.buildSuccess());
        });

    }

    // @PostMapping({route: '/pm/application/upload/:applicationName'})
    // static async uploadApplication(ctx) {
    //
    //     const applicationName = ctx.params.applicationName;
    //     if (!applicationName) {
    //         return ctx.response.body = Response.buildParamError('Application Name is required');
    //     }
    //
    //     console.log(ctx.request.body);
    //
    //     if (!ctx.request.body || !ctx.request.body.files || !ctx.request.body.files.file) {
    //         return ctx.response.body = Response.buildParamError('Application Package is required');
    //     }
    //
    //     ctx.response.body = await ApplicationService.uploadApplication(applicationName, ctx.request.body.files.file);
    //
    // }

    @PutMapping({route: '/pm/application/start/:applicationName'})
    static async startByName(ctx) {

        const applicationName = ctx.params.applicationName;
        if (applicationName == undefined) {
            return ctx.response.body = Response.buildParamError('Application Name is required');
        }

        ctx.response.body = await ApplicationService.startByName(applicationName);

    }

    @PutMapping({route: '/pm/application/stop/:applicationId'})
    static async stopById(ctx) {

        const applicationId = ctx.params.applicationId;
        if (applicationId == undefined) {
            return ctx.response.body = Response.buildParamError('Application ID is required');
        }

        ctx.response.body = await ApplicationService.stopById(applicationId);

    }

    @PutMapping({route: '/pm/application/stop'})
    static async stopAll(ctx) {
        ctx.response.body = await ApplicationService.stopAll();
    }

    @PutMapping({route: '/pm/application/restart/:applicationId'})
    static async restartById(ctx) {

        const applicationId = ctx.params.applicationId;
        if (applicationId == undefined) {
            return ctx.response.body = Response.buildParamError('Application ID is required');
        }

        ctx.response.body = await ApplicationService.restartById(applicationId);

    }

    @PutMapping({route: '/pm/application/restart'})
    static async restartAll(ctx) {
        ctx.response.body = await ApplicationService.restartAll();
    }

    @PutMapping({route: '/pm/application/delete/:applicationId'})
    static async deleteById(ctx) {

        const applicationId = ctx.params.applicationId;
        if (applicationId == undefined) {
            return ctx.response.body = Response.buildParamError('Application ID is required');
        }

        ctx.response.body = await ApplicationService.deleteById(applicationId);

    }

    @PutMapping({route: '/pm/application/delete'})
    static async deleteAll(ctx) {
        ctx.response.body = await ApplicationService.deleteAll();
    }

    @PutMapping({route: '/pm/application/reload/:applicationId'})
    static async reloadById(ctx) {

        const applicationId = ctx.params.applicationId;
        if (applicationId == undefined) {
            return ctx.response.body = Response.buildParamError('Application ID is required');
        }

        ctx.response.body = await ApplicationService.reloadById(applicationId);

    }

    @PutMapping({route: '/pm/application/reload'})
    static async reloadAll(ctx) {
        ctx.response.body = await ApplicationService.reloadAll();
    }

};

export default ApplicationController;
