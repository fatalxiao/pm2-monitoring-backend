import ApplicationService from '../service/ApplicationService.js';
import Response from '../utils/Response.js';
import {GetMapping, PostMapping, PutMapping, DeleteMapping} from '../utils/ApiDecorator';

class ApplicationController {

    @PostMapping({route: '/pm/application/upload/:applicationName', upload: true})
    static async uploadApplication(ctx) {

        const applicationName = ctx.params.applicationName;
        if (!applicationName) {
            return ctx.response.body = Response.buildParamError('Application Name is required');
        }

        if (!ctx.request.files || !ctx.request.files.file) {
            return ctx.response.body = Response.buildParamError('Application Package is required');
        }

        ctx.response.body = await ApplicationService.upload(applicationName, ctx.request.files.file);

    }

    @PostMapping({route: '/pm/application/create'})
    static async create(ctx) {

        const requestData = ctx.request.body;
        if (!requestData || !requestData.name) {
            return ctx.response.body = Response.buildParamError('Application Name is required');
        }

        ctx.response.body = await ApplicationService.create(requestData);

    }

    @PutMapping({route: '/pm/application/update/:applicationName'})
    static async update(ctx) {

        const applicationName = ctx.params.applicationName;
        if (applicationName == undefined) {
            return ctx.response.body = Response.buildParamError('Application Name is required');
        }

        const config = ctx.request.body;
        if (!config) {
            return ctx.response.body = Response.buildSuccess();
        }

        ctx.response.body = await ApplicationService.update(applicationName, ctx.request.body);

    }

    @PutMapping({route: '/pm/application/process/start/:applicationName'})
    static async startByName(ctx) {

        const applicationName = ctx.params.applicationName;
        if (applicationName == undefined) {
            return ctx.response.body = Response.buildParamError('Application Name is required');
        }

        ctx.response.body = await ApplicationService.startByName(applicationName);

    }

    @PutMapping({route: '/pm/application/process/stop/:applicationId'})
    static async stopById(ctx) {

        const applicationId = ctx.params.applicationId;
        if (applicationId == undefined) {
            return ctx.response.body = Response.buildParamError('Application ID is required');
        }

        ctx.response.body = await ApplicationService.stopById(applicationId);

    }

    @PutMapping({route: '/pm/application/process/stop'})
    static async stopAll(ctx) {
        ctx.response.body = await ApplicationService.stopAll();
    }

    @PutMapping({route: '/pm/application/process/restart/:applicationId'})
    static async restartById(ctx) {

        const applicationId = ctx.params.applicationId;
        if (applicationId == undefined) {
            return ctx.response.body = Response.buildParamError('Application ID is required');
        }

        ctx.response.body = await ApplicationService.restartById(applicationId);

    }

    @PutMapping({route: '/pm/application/process/restart'})
    static async restartAll(ctx) {
        ctx.response.body = await ApplicationService.restartAll();
    }

    @PutMapping({route: '/pm/application/process/delete/:applicationId'})
    static async deleteById(ctx) {

        const applicationId = ctx.params.applicationId;
        if (applicationId == undefined) {
            return ctx.response.body = Response.buildParamError('Application ID is required');
        }

        ctx.response.body = await ApplicationService.deleteById(applicationId);

    }

    @PutMapping({route: '/pm/application/process/delete'})
    static async deleteAll(ctx) {
        ctx.response.body = await ApplicationService.deleteAll();
    }

    @PutMapping({route: '/pm/application/process/reload/:applicationId'})
    static async reloadById(ctx) {

        const applicationId = ctx.params.applicationId;
        if (applicationId == undefined) {
            return ctx.response.body = Response.buildParamError('Application ID is required');
        }

        ctx.response.body = await ApplicationService.reloadById(applicationId);

    }

    @PutMapping({route: '/pm/application/process/reload'})
    static async reloadAll(ctx) {
        ctx.response.body = await ApplicationService.reloadAll();
    }

    @GetMapping({route: '/pm/application/exist/:applicationName'})
    static async checkNameExist(ctx) {

        const applicationName = ctx.params.applicationName;
        if (!applicationName) {
            return ctx.response.body = Response.buildParamError('Application Name is required');
        }

        ctx.response.body = await ApplicationService.checkNameExist(applicationName);

    }

    @PutMapping({route: '/pm/application/rename/:applicationName'})
    static async rename(ctx) {

        const originName = ctx.params.applicationName;
        if (!originName) {
            return ctx.response.body = Response.buildParamError('Origin Application Name is required');
        }

        const requestData = ctx.request.body;
        if (!requestData || !requestData.name) {
            return ctx.response.body = Response.buildParamError('New Application Name is required');
        }

        if (originName === requestData.name) {
            return ctx.response.body = Response.buildSuccess('');
        }

        ctx.response.body = await ApplicationService.rename(originName, requestData.name);

    }

    @DeleteMapping({route: '/pm/application/delete/:applicationName'})
    static async del(ctx) {

        const applicationName = ctx.params.applicationName;
        if (!applicationName) {
            return ctx.response.body = Response.buildParamError('Application Name is required');
        }

        ctx.response.body = await ApplicationService.del(applicationName);

    }

};

export default ApplicationController;
