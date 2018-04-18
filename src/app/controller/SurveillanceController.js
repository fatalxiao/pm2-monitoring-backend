import SurveillanceService from '../service/SurveillanceService.js';
import {GetMapping} from '../utils/ApiDecorator';

class SurveillanceController {

    @GetMapping({value: '/ps/surveillance'})
    static async getCurrent(ctx) {
        ctx.response.body = await SurveillanceService.getCurrent();
    }

};

export default SurveillanceController;