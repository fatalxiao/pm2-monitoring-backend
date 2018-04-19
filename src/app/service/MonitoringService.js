import rp from 'request-promise';
import Response from '../utils/Response.js';

async function getCurrent() {

    const json = await rp('http://localhost:9615');

    try {
        const data = JSON.parse(json);
        return Response.buildSuccess(data);
    } catch (e) {
        return Response.buildError('Request PM2 HTTP Interface Failure.');
    }

};

export default {
    getCurrent
};