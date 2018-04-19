import rp from 'request-promise';
import Response from '../utils/Response.js';

async function getCurrent() {

    const json = await rp('http://localhost:9615');
    console.log(json);

    return Response.buildSuccess(json);

};

export default {
    getCurrent
};