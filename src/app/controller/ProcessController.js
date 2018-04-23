import ProcessService from '../service/ProcessService.js';
import Response from '../utils/Response.js';
import {GetMapping, PostMapping, WsGetMapping} from '../utils/ApiDecorator';

class ProcessController {

    @GetMapping({route: '/pm/processes'})
    static async getAll(ctx) {
        ctx.response.body = await ProcessService.getAll();
    }

    @WsGetMapping({route: '/pm/process/upload/:processName'})
    static async getCurrent(ctx) {

        const processName = ctx.params.processName;
        if (!processName) {
            return ctx.websocket.send(Response.buildParamError('Process Name is required'));
        }

        ctx.websocket.on('message', message => {
            console.log(message);
        });

    }

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