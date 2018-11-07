import ApplicationsService from '../service/ApplicationsService.js';
import {WsGetMapping} from '../utils/ApiDecorator';

class ApplicationsController {

    @WsGetMapping({route: '/ws/pm/applications'})
    static async getApplications(ctx) {
        ctx.websocket.on('message', async () => {
            const data = await ApplicationsService.getApplications();
            ctx.websocket.send(data);
        });
    }

};

export default ApplicationsController;
