import ProcessService from '../service/ProcessService.js';
import Response from '../utils/Response.js';
import {GetMapping, PostMapping} from '../utils/ApiDecorator';

class ProcessController {

    @GetMapping({value: '/pm/processes'})
    static async getAll(ctx) {
        ctx.response.body = await ProcessService.getAll();
    }

    @PostMapping({value: '/pm/process/start/:processId'})
    static async start(ctx) {

        const processId = ctx.params.processId;
        if (!processId) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await ProcessService.start(processId);

    }

};

export default ProcessController;