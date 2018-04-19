import MonitoringService from '../service/MonitoringService.js';
import {WsGetMapping} from '../utils/ApiDecorator';

class MonitoringController {

    @WsGetMapping({route: '/pm/monitoring'})
    static async getCurrent(ctx) {

        const res = await MonitoringService.getCurrent();

        ctx.websocket.send(res);

        ctx.websocket.on('message', () => {
            ctx.websocket.send(res);
        });

    }

};

export default MonitoringController;