import Response from '../utils/Response.js';
import PMUtil from '../utils/PMUtil.js';
import ApplicationsUtil from '../utils/ApplicationUtil.js';
import TimeUtil from '../utils/TimeUtil.js';

async function upload(applicationName, file) {
    try {

        await ApplicationsUtil.savePackage(applicationName, file);
        await ApplicationsUtil.decompressPackage(applicationName);
        await ApplicationsUtil.cleanPackage(applicationName);
        await ApplicationsUtil.installDependencies(applicationName);

        return Response.buildSuccess('');

    } catch (e) {
        console.log(e);
        return Response.buildError('Upload Application Failed');
    }
};

async function create(config) {
    try {

        if (ApplicationsUtil.isNameExist(config.name)) {
            return Response.buildParamError({
                name: 'Application Name is duplicated'
            });
        }

        const now = TimeUtil.getCurrentTime(),
            proc = await ApplicationsUtil.appendConfig({
                ...ApplicationsUtil.formatToEcosystemConfig(config),
                createTime: now,
                lastUpdateTime: now,
                lastStartTime: null
            });
        return Response.buildSuccess(proc);

    } catch (e) {
        return Response.buildError('Create Application Failed');
    }
};

async function update(applicationName, config) {
    try {

        if (!ApplicationsUtil.isNameExist(applicationName)) {
            return Response.buildParamError({
                name: 'Application Name is undefined'
            });
        }

        const proc = await ApplicationsUtil.updateConfig(applicationName, {
            ...ApplicationsUtil.formatToEcosystemConfig(config, ApplicationsUtil.getConfig(applicationName)),
            lastUpdateTime: TimeUtil.getCurrentTime()
        });
        return Response.buildSuccess(proc);

    } catch (e) {
        return Response.buildError('Update Application Failed');
    }
};

async function start(options) {
    try {

        const proc = await PMUtil.start(options);

        await ApplicationsUtil.updateConfig(options.name, {
            lastStartTime: TimeUtil.getCurrentTime()
        });

        return Response.buildSuccess(proc);

    } catch (e) {
        return Response.buildError('Start Application Failed');
    }
};

async function startByName(applicationName) {

    const applications = ApplicationsUtil.getConfigs();
    let index;

    if (!applications || applications.length < 1
        || (index = applications.findIndex(item => item.name === applicationName)) === -1) {
        return Response.buildParamError('Application Name Not Found');
    }

    return await start(applications[index]);

};

async function stopById(applicationId) {
    try {
        const proc = await PMUtil.stopById(applicationId);
        return Response.buildSuccess(proc);
    } catch (e) {
        return Response.buildError('Stop Application Failed');
    }
};

async function stopByName(applicationName) {
    try {
        const proc = await PMUtil.stopByName(applicationName);
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
        return Response.buildError('Stop Applications Failed');
    }
};

async function restartById(applicationId) {
    try {

        const proc = await PMUtil.restartById(applicationId);

        if (proc && proc[0] && proc[0].name) {
            await ApplicationsUtil.updateConfig(proc[0].name, {
                lastStartTime: TimeUtil.getCurrentTime()
            });
        }

        return Response.buildSuccess(proc);

    } catch (e) {
        return Response.buildError('Restart Application Failed');
    }
};

async function restartAll() {
    try {

        const proc = await PMUtil.restartAll(),
            applications = ApplicationsUtil.getConfigs();

        for (let application of applications) {
            if (application && application.name) {
                await ApplicationsUtil.updateConfig(application.name, {
                    lastStartTime: TimeUtil.getCurrentTime()
                });
            }
        }

        return Response.buildSuccess(proc);

    } catch (e) {
        return Response.buildError('Restart Applications Failed');
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
        return Response.buildError('Delete Applications Failed');
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
        return Response.buildError('Reload Applications Failed');
    }
};

async function checkNameExist(applicationName) {
    try {
        Response.buildSuccess(ApplicationsUtil.isNameExist(applicationName));
    } catch (e) {
        return Response.buildError('Check application name exist Failed');
    }
};

async function rename(originName, newName) {
    try {

        if (!ApplicationsUtil.isNameExist(originName)) {
            return Response.buildParamError({
                name: 'Application Name is undefined'
            });
        }

        const status = await PMUtil.getStatusByName(originName);
        if (status && status !== 'offline') {
            await PMUtil.deleteByName(originName);
        }

        await ApplicationsUtil.updateApplicationName(originName, newName);
        await ApplicationsUtil.renamePackage(originName, newName);
        await ApplicationsUtil.renameApplication(originName, newName);

        return Response.buildSuccess();

    } catch (e) {
        return Response.buildError('Reset application name Failed');
    }
};

async function del(applicationName) {
    try {

        if (!ApplicationsUtil.isNameExist(applicationName)) {
            return Response.buildParamError({
                name: 'Application Name is undefined'
            });
        }

        const status = await PMUtil.getStatusByName(applicationName);
        if (status && status !== 'offline') {
            await PMUtil.deleteByName(applicationName);
        }

        await ApplicationsUtil.deletePackage(applicationName);
        await ApplicationsUtil.deleteApplication(applicationName);

        return Response.buildSuccess();

    } catch (e) {
        return Response.buildError('Delete application Failed');
    }
};

export default {
    upload,
    create,
    update,
    start,
    startByName,
    stopById,
    stopByName,
    stopAll,
    restartById,
    restartAll,
    deleteById,
    deleteAll,
    reloadById,
    reloadAll,
    checkNameExist,
    rename,
    del
};
