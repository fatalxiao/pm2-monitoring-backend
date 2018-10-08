import Response from '../utils/Response.js';
import PMUtil from '../utils/PMUtil.js';
import {getApplicationsConfig, appendApplicationConfig} from '../utils/ApplicationsUtil.js';

async function create(config) {
    try {
        const proc = await appendApplicationConfig(config);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Create Application Failed');
    }
};

async function start(options) {
    try {
        const proc = await PMUtil.start(options);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Start Application Failed');
    }
};

async function startByName(applicationName) {

    const data = getApplicationsConfig();
    let index;

    if (!data || data.length < 1
        || (index = data.findIndex(item => item.name === applicationName)) === -1) {
        return Response.buildParamError('Application Name Not Found');
    }

    return await start(data[index]);

};

async function stopById(applicationId) {
    try {
        const proc = await PMUtil.stopById(applicationId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Stop Application Failed');
    }
};

async function stopAll() {
    try {
        const proc = await PMUtil.stopAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Stop Applicationes Failed');
    }
};

async function restartById(applicationId) {
    try {
        const proc = await PMUtil.restartById(applicationId);
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

async function deleteById(applicationId) {
    try {
        const proc = await PMUtil.deleteById(applicationId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Delete Application Failed');
    }
};

async function deleteAll() {
    try {
        const proc = await PMUtil.deleteAll();
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Delete Applicationes Failed');
    }
};

async function reloadById(applicationId) {
    try {
        const proc = await PMUtil.reloadById(applicationId);
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
    create,
    start,
    startByName,
    stopById,
    stopAll,
    restartById,
    restartAll,
    deleteById,
    deleteAll,
    reloadById,
    reloadAll
};
