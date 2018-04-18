import SurveillanceService from '../service/SurveillanceService.js';
import {GetMapping} from '../utils/ApiDecorator';

class SurveillanceController {

    @GetMapping({value: '/pm2surveillance/surveillance'})
    static async getCurrent(ctx) {
        ctx.response.body = await SurveillanceService.getCurrent();
    }

};

export default SurveillanceController;