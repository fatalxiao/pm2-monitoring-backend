import Response from '../utils/Response.js';
import {getProcessesConfig} from '../utils/ProcessUtil.js';
import PMUtil from '../utils/PMUtil.js';

async function getProcesses() {

    const data = getProcessesConfig();

    if (!data) {
        return Response.buildSuccess([]);
    }

    try {

        // get pm2 list data
        const processList = await PMUtil.list();

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

    } catch (e) {
        return Response.buildError('Get Process List Failed');
    }

};

async function start(options) {
    try {
        const proc = await PMUtil.start(options);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Start Process Failed');
    }
};

async function startByName(processName) {

    const data = getProcessesConfig();
    let index;

    if (!data || data.length < 1
        || (index = data.findIndex(item => item.name === processName) === -1)) {
        return Response.buildParamError('Process Name Not Found');
    }

    return start(data[index]);

};

async function pauseById(processId) {
    try {
        const proc = await PMUtil.pauseById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Stop Process Failed');
    }
};

async function pauseAll() {
    try {
        const proc = await PMUtil.pauseAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Stop Processes Failed');
    }
};

async function restartById(processId) {
    try {
        const proc = await PMUtil.restartById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Restart Process Failed');
    }
};

async function restartAll() {
    try {
        const proc = await PMUtil.restartAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Restart Processes Failed');
    }
};

async function stopById(processId) {
    try {
        const proc = await PMUtil.stopById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Delete Process Failed');
    }
};

async function stopAll() {
    try {
        const proc = await PMUtil.stopAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Delete Processes Failed');
    }
};

async function reloadById(processId) {
    try {
        const proc = await PMUtil.reloadById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Reload Process Failed');
    }
};

async function reloadAll() {
    try {
        const proc = await PMUtil.reloadAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Reload Processes Failed');
    }
};

export default {
    getProcesses,
    start,
    startByName,
    pauseById,
    pauseAll,
    restartById,
    restartAll,
    stopById,
    stopAll,
    reloadById,
    reloadAll
};
