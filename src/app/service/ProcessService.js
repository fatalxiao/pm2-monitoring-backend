import Response from '../utils/Response.js';
import {getProcessesConfig} from '../utils/ProcessUtil.js';
import {getPMList} from '../utils/PMUtil.js';

async function getProcesses() {

    const data = getProcessesConfig();

    if (!data) {
        return Response.buildSuccess([]);
    }

    const list = await getPMList();

    return Response.buildSuccess(list);

};

async function start(processId) {
    return Response.buildSuccess();
};

export default {
    getProcesses,
    start
};