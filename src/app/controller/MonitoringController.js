import MonitoringService from '../service/MonitoringService.js';
import {WsGetMapping} from '../utils/ApiDecorator';

class MonitoringController {

    @WsGetMapping({route: '/pm/monitoring'})
    static async getCurrent(ctx) {
        ctx.response.body = await MonitoringService.getCurrent();
    }

};

export default MonitoringController;