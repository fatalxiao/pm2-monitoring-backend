import Response from '../utils/Response.js';
import {getProcessesConfig} from '../utils/ProcessUtil.js';
import {getPMList} from '../utils/PMUtil.js';

async function getProcesses() {

    const data = getProcessesConfig();

    if (!data) {
        return Response.buildSuccess([]);
    }

    const processList = await getPMList();

    for (let item of data) {

        if (!item) {
            continue;
        }

        const index = processList.findIndex(p => p && p.name === item.name);

        if (index !== -1) {
            data;
        }

    }

    return Response.buildSuccess(data.filter(item => item).map(item => {
        const index = processList.findIndex(p => p && p.name === item.name);
        return index === -1 ? item : {...item, ...processList[index]};
    }));

};

async function start(processId) {
    return Response.buildSuccess();
};

export default {
    getProcesses,
    start
};