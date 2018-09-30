import Response from '../utils/Response.js';
import PMUtil from '../utils/PMUtil.js';

async function start(options) {
    try {
        const proc = await PMUtil.start(options);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Start Application Failed');
    }
};

async function startByName(processName) {

    const data = getProcessesConfig();
    let index;

    if (!data || data.length < 1
        || (index = data.findIndex(item => item.name === processName)) === -1) {
        return Response.buildParamError('Application Name Not Found');
    }

    return await start(data[index]);

};

async function pauseById(processId) {
    try {
        const proc = await PMUtil.pauseById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Stop Application Failed');
    }
};

async function pauseAll() {
    try {
        const proc = await PMUtil.pauseAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Stop Applicationes Failed');
    }
};

async function restartById(processId) {
    try {
        const proc = await PMUtil.restartById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Restart Application Failed');
    }
};

async function restartAll() {
    try {
        const proc = await PMUtil.restartAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Restart Applicationes Failed');
    }
};

async function stopById(processId) {
    try {
        const proc = await PMUtil.stopById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Delete Application Failed');
    }
};

async function stopAll() {
    try {
        const proc = await PMUtil.stopAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Delete Applicationes Failed');
    }
};

async function reloadById(processId) {
    try {
        const proc = await PMUtil.reloadById(processId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Reload Application Failed');
    }
};

async function reloadAll() {
    try {
        const proc = await PMUtil.reloadAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Reload Applicationes Failed');
    }
};

export default {
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
