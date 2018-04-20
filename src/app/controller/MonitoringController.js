import MonitoringService from '../service/MonitoringService.js';
import {WsGetMapping} from '../utils/ApiDecorator';

class MonitoringController {

    @WsGetMapping({route: '/pm/monitoring'})
    static async getCurrent(ctx) {
        ctx.websocket.on('message', () => {
            MonitoringService.getCurrent().then(data => ctx.websocket.send(data));
        });
    }

};

export default MonitoringController;