import Response from '../utils/Response.js';
import {getProcessesConfig} from '../utils/ProcessUtil.js';
import {
    getPMList,
    start,
    stopById,
    stopAll,
    restartById,
    restartAll,
    delById,
    delAll,
    reloadById,
    reloadAll
} from '../utils/PMUtil.js';

async function getProcesses() {

    const data = getProcessesConfig();

    if (!data) {
        return Response.buildSuccess([]);
    }

    try {

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

    } catch (e) {
        return Response.buildError(e);
    }

};

async function start(options) {
    try {
        const proc = await start(options);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError(e);
    }
};

async function stopById(processId) {
    try {
        const proc = await stopById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError(e);
    }
};

async function stopAll() {
    try {
        const proc = await stopAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError(e);
    }
};

async function restartById(processId) {
    try {
        const proc = await restartById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError(e);
    }
};

async function restartAll() {
    try {
        const proc = await restartAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError(e);
    }
};

async function delById(processId) {
    try {
        const proc = await delById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError(e);
    }
};

async function delAll() {
    try {
        const proc = await delAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError(e);
    }
};

async function reloadById(processId) {
    try {
        const proc = await reloadById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError(e);
    }
};

async function reloadAll() {
    try {
        const proc = await reloadAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError(e);
    }
};

export default {
    getProcesses,
    start,
    stopById,
    stopAll,
    restartById,
    restartAll,
    delById,
    delAll,
    reloadById,
    reloadAll
};
