import Response from '../utils/Response.js';

async function getAll() {
    return Response.buildSuccess();
};

async function start(processId) {
    return Response.buildSuccess();
};

export default {
    getAll,
    start
};