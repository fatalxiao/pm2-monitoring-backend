import fs from 'fs';
import FsUtil from './FsUtil';
import {exec} from 'child_process';
import unzip from 'unzip-stream';
import config from '../../config';

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
function formatToEcosystemConfig(userConfig) {

    if (!userConfig) {
        return;
    }

    const name = userConfig.name || DEFAULT_CONFIG.name,
        script = userConfig.script || DEFAULT_CONFIG.script,
        port = userConfig.port || DEFAULT_CONFIG.port,
        result = {
            name,
            script: `${dirPath}/${name}/${script}`,
            rawScript: script,
            instances: userConfig.instances || DEFAULT_CONFIG.instances,
            env: {
                NODE_ENV: userConfig.env || DEFAULT_CONFIG.env
            },
            description: userConfig.description || DEFAULT_CONFIG.description,
            createTime: userConfig.createTime || null,
            lastUpdateTime: userConfig.lastUpdateTime || null,
            lastStartTime: userConfig.lastStartTime || null
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

function isNameExist(name) {

    if (!name) {
        return false;
    }

    try {

        const applications = getConfigs();

        if (!applications || applications.length < 1) {
            return false;
        }

        return applications.findIndex(item => item && item.name === name) !== -1;

    } catch (e) {
        return;
    }

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
        applications.push(formatToEcosystemConfig(config));

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

        const formatedConfig = formatToEcosystemConfig(config);
        delete formatedConfig.name;

        applications[index] = {
            ...applications[index],
            ...formatedConfig
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

export default {

    DEFAULT_CONFIG,

    formatToEcosystemConfig,
    formatToUserConfig,
    getConfigs,
    setConfigs,
    isNameExist,
    appendConfig,
    updateConfig,
    hasPackage,
    savePackage,
    decompressPackage,
    cleanPackage,
    installDependencies

};
