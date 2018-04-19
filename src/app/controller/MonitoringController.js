import MonitoringService from '../service/MonitoringService.js';
import {WsGetMapping} from '../utils/ApiDecorator';

class MonitoringController {

    @WsGetMapping({route: '/pm/monitoring'})
    static async getCurrent(ctx) {

        ctx.websocket.send(await MonitoringService.getCurrent());

        ctx.websocket.on('message', function (message) {
            console.log(message);
        });

    }

};

export default MonitoringController;