import pm2 from 'pm2';
import Response from '../utils/Response.js';

function getCurrent() {
    return new Promise((resolve, reject) => {
        pm2.list((err, processDescriptionList) => {
            if (err) {
                reject(Response.buildError('Request PM2 HTTP Interface Failure.'));
            }
            resolve(Response.buildSuccess(processDescriptionList));
        });
    });
};

export default {
    getCurrent
};