import MonitoringService from '../service/MonitoringService.js';
import {GetMapping} from '../utils/ApiDecorator';

class MonitoringController {

    @GetMapping({route: '/pm/monitoring'})
    static async getCurrent(ctx) {
        ctx.response.body = await MonitoringService.getCurrent();
    }

};

export default MonitoringController;