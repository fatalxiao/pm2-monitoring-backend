import Response from '../utils/Response.js';

async function getCurrent() {
    return Response.buildSuccess();
};

export default {
    getCurrent
};