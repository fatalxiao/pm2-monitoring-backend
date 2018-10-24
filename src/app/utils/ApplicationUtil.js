import fs from 'fs';
import FsUtil from './FsUtil';
import {exec} from 'child_process';
import unzip from 'unzip-stream';
import config from '../../config';
import PMUtil from './PMUtil';

const dirPath = `${config.appsRootPath}/pm2-apps`,
    configPath = `${config.appsRootPath}/ecosystem.config.js`;

/**
 * default application config
 * @type {{name: string, description: string, instances: number, script: string, port: string, env: string, envProd: string}}
 */
const DEFAULT_CONFIG = {
    name: '',
    description: '',
    instances: 1,
    script: 'server.js',
    port: '',
    env: 'production'
};

/**
 * format config to pm2 option
 * @param config
 * @returns {{name: *, script: *, instances: (Array|number), port: *, env: {NODE_ENV: *}, env_production: {NODE_ENV: (string|string)}, description: string | string | *}}
 */
function formatToEcosystemConfig(userConfig, template = DEFAULT_CONFIG) {

    if (!userConfig) {
        return;
    }

    const name = userConfig.name || template.name,
        script = userConfig.script || template.script,
        port = userConfig.port || template.port,
        result = {
            name,
            script: `${dirPath}/${name}/${script}`,
            rawScript: script,
            instances: userConfig.instances || template.instances,
            env: {
                NODE_ENV: userConfig.env || template.env
            },
            description: userConfig.description || template.description
        };

    if (port) {
        result.port = +port;
    }

    return result;

}

function formatToUserConfig(ecosystemConfig) {

    if (!ecosystemConfig) {
        return;
    }

    return {
        name: ecosystemConfig.name || '',
        script: ecosystemConfig.rawScript || '',
        instances: ecosystemConfig.instances || '',
        env: ecosystemConfig.env.NODE_ENV || '',
        description: ecosystemConfig.description || '',
        port: ecosystemConfig.port || '',
        createTime: ecosystemConfig.createTime || null,
        lastUpdateTime: ecosystemConfig.lastUpdateTime || null,
        lastStartTime: ecosystemConfig.lastStartTime || null
    };

}

function checkAppDir() {
    if (!FsUtil.isExistSync(config.appsRootPath)) {
        fs.mkdirSync(config.appsRootPath);
    }
    if (!FsUtil.isExistSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

/**
 * read applications config in file <applications.json>
 * @returns {any}
 */
function getConfigs() {

    try {

        const config = require(configPath);

        if (!config) {
            return [];
        }

        return config.apps || [];


    } catch (e) {
        return [];
    }

}

/**
 * write applications config to file <applications.json>
 * @param config
 */
function setConfigs(config) {

    if (!config) {
        return;
    }

    try {

        checkAppDir();

        return fs.writeFileSync(configPath, 'module.exports={apps:' + JSON.stringify(config) + '};');

    } catch (e) {
        return;
    }

}

function getConfig(applicationName) {

    if (!applicationName) {
        return;
    }

    try {

        const applications = getConfigs();

        if (!applications || applications.length < 1) {
            return;
        }

        return applications.find(item => item && item.name === applicationName);

    } catch (e) {
        return;
    }

}

async function getApplications() {

    const data = getConfigs();

    if (!data) {
        return [];
    }

    // get pm2 list data
    const processList = await PMUtil.list();

    return data.filter(item => item).map(item => {

        item = formatToUserConfig(item);

        const index = processList.findIndex(p => p && p.name === item.name),
            result = index === -1 ? {
                ...item,
                status: 'offline',
                port: ''
            } : {
                ...item,
                pid: processList[index].pid,
                pm_id: processList[index].pm_id,
                status: processList[index].pm2_env.status || 'offline',
                port: processList[index].port || '',
                monit: processList[index].monit
            };

        return {
            ...result,
            isReady: hasPackage(item.name)
        };

    });

}

function isNameExist(applicationName) {
    return !!getConfig(applicationName);
}

/**
 * append new application config
 * @param config
 * @returns {*|void}
 */
function appendConfig(config) {

    if (!config || !config.name) {
        return;
    }

    try {

        const applications = getConfigs();
        applications.push(config);

        return setConfigs(applications);

    } catch (e) {
        return;
    }

}

/**
 * update new application config
 * @param config
 * @returns {*|void}
 */
function updateConfig(applicationName, config) {

    if (!applicationName || !config) {
        return;
    }

    try {

        const applications = getConfigs(),
            index = applications.findIndex(item => item && item.name === applicationName);

        if (index === -1) {
            return;
        }

        delete config.name;

        applications[index] = {
            ...applications[index],
            ...config
        };

        return setConfigs(applications);

    } catch (e) {
        return;
    }

}

/**
 * check the application has package or not
 * @param name
 * @returns {boolean}
 */
function hasPackage(name) {

    if (!name) {
        return false;
    }

    try {

        checkAppDir();

        return FsUtil.isExistSync(`${dirPath}/${name}`);

    } catch (e) {
        return;
    }

}

function rmPackage(name) {

    if (!name || !hasPackage(name)) {
        return;
    }

    try {

        checkAppDir();

        FsUtil.rmRecursionSync(`${dirPath}/${name}`);

    } catch (e) {
        return;
    }

}

function savePackage(name, file) {
    return new Promise(resolve => {

        checkAppDir();

        const reader = fs.createReadStream(file.path),
            filePath = `${dirPath}/${name}.zip`,
            writer = fs.createWriteStream(filePath);

        writer.on('close', () => {
            resolve();
        });

        reader.pipe(writer);

    });
}

function decompressPackage(name) {
    return new Promise((resolve, reject) => {

        if (!name) {
            reject();
        }

        checkAppDir();
        rmPackage(name);

        fs.createReadStream(`${dirPath}/${name}.zip`).pipe(unzip.Extract({
            path: `${dirPath}/${name}`
        }).on('close', () => {
            resolve();
        }));

    });
}

function cleanPackage(name) {
    return new Promise((resolve, reject) => {

        if (!name) {
            reject();
        }

        checkAppDir();

        const appPath = `${dirPath}/${name}`,
            paths = fs.readdirSync(appPath);

        if (paths && paths.length === 1 && fs.statSync(`${appPath}/${paths[0]}`).isDirectory()) {
            FsUtil.copyRecursionSync(`${appPath}/${paths[0]}`, appPath);
            FsUtil.rmRecursionSync(`${appPath}/${paths[0]}`);
        }

        resolve();

    });
}

/**
 * install node dependencies
 */
function installDependencies(name) {
    return new Promise((resolve, reject) => {

        if (!name) {
            reject();
        }

        checkAppDir();

        exec('npm i -d', {
            cwd: `${dirPath}/${name}`
        }, error => {
            if (error) {
                reject(error);
            }
        }).on('close', () => {
            resolve();
        });

    });
}

/**
 * reset package name
 */
function renamePackage(originName, newName) {
    return new Promise((resolve, reject) => {

        if (!originName || !newName) {
            reject();
        }

        checkAppDir();

        const originAppPath = `${dirPath}/${originName}.zip`,
            newAppPath = `${dirPath}/${newName}.zip`;

        fs.copyFileSync(originAppPath, newAppPath);
        fs.unlinkSync(originAppPath);

        resolve();

    });
}

/**
 * reset application name
 */
function renameApplication(originName, newName) {
    return new Promise((resolve, reject) => {

        if (!originName || !newName) {
            reject();
        }

        checkAppDir();

        const originAppPath = `${dirPath}/${originName}`,
            newAppPath = `${dirPath}/${newName}`;

        if (fs.statSync(originAppPath).isDirectory()) {
            FsUtil.copyRecursionSync(originAppPath, newAppPath);
            FsUtil.rmRecursionSync(originAppPath);
        }

        resolve();

    });
}

export default {

    DEFAULT_CONFIG,

    formatToEcosystemConfig,
    formatToUserConfig,
    getConfigs,
    setConfigs,
    getConfig,
    getApplications,
    isNameExist,
    appendConfig,
    updateConfig,
    hasPackage,
    savePackage,
    decompressPackage,
    cleanPackage,
    installDependencies,
    renamePackage,
    renameApplication

};
