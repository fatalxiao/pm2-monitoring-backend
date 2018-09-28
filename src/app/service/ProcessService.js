import Response from '../utils/Response.js';
import {getProcessesConfig} from '../utils/ProcessUtil.js';
import {getPMList} from '../utils/PMUtil.js';

async function getProcesses() {

    const data = getProcessesConfig();

    if (!data) {
        return Response.buildSuccess([]);
    }

    // get pm2 list data
    const processList = await getPMList();

    return Response.buildSuccess(data.filter(item => item).map(item => {
        const index = processList.findIndex(p => p && p.name === item.name);
        return index === -1 ? item : {
            ...item,
            pid: processList[index].pid,
            pm_id: processList[index].pm_id,
            status: processList[index].pm2_env.status,
            monit: processList[index].monit
        };
    }));

};

async function start(processId) {
    return Response.buildSuccess();
};

export default {
    getProcesses,
    start
};
