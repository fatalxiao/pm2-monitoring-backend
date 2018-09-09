import Response from '../utils/Response.js';
import {getProcessesConfig} from '../utils/ProcessUtil.js';

async function getProcesses() {

    const data = getProcessesConfig();

    if (!data) {
        return Response.buildSuccess([]);
    }

    return Response.buildSuccess(data);

};

async function start(processId) {
    return Response.buildSuccess();
};

export default {
    getProcesses,
    start
};