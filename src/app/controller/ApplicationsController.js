import ApplicationsService from '../service/ApplicationsService.js';
import {WsGetMapping} from '../utils/ApiDecorator';

class ApplicationsController {

    @WsGetMapping({route: '/pm/applications'})
    static async getApplications(ctx) {
        ctx.websocket.on('message', () => {
            ApplicationsService.getApplications().then(data => ctx.websocket.send(data));
        });
    }

};

export default ApplicationsController;
