import AppService from '../service/AppService.js';
import Response from '../utils/Response.js';
import {GetMapping, PostMapping} from '../utils/ApiDecorator';

class AppController {

    @PostMapping({value: '/dpe/analgesia/getAnalgesiaDataByPatientId/:patientId'})
    static async startProcess(ctx) {

        const processId = ctx.params.processId;
        if (!processId) {
            return ctx.response.body = Response.buildParamError('Process ID is required');
        }

        ctx.response.body = await AppService.start(processId);

    }

};

export default AppController;