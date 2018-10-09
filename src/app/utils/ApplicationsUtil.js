import path from 'path';
import fs from 'fs';
import FsUtil from './FsUtil';
import {exec} from 'child_process';
import unzip from 'unzip-stream';

const dirPath = path.resolve(__dirname, '../../pm2-apps'),
    configPath = path.resolve(__dirname, '../../ecosystem.config.js');

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
function formatConfig(config) {

    if (!config) {
        return;
    }

    const port = config.port || DEFAULT_CONFIG.port,
        result = {
            name: config.name || DEFAULT_CONFIG.name,
            script: config.script || DEFAULT_CONFIG.script,
            instances: config.instances || DEFAULT_CONFIG.instances,
            env: {
                NODE_ENV: config.env || DEFAULT_CONFIG.env
            },
            description: config.description || DEFAULT_CONFIG.description
        };

    if (port) {
        result.port = +port;
    }

    return result;

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
        return fs.writeFileSync(configPath, 'module.exports={apps:' + JSON.stringify(config) + '};');
    } catch (e) {
        return;
    }

}

function isNameExist(name) {

    if (!name) {
        return false;
    }

    const applications = getConfigs();

    if (!applications || applications.length < 1) {
        return false;
    }

    return applications.findIndex(item => item && item.name === name) !== -1;

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

    const applications = getConfigs();
    applications.push(formatConfig(config));

    return setConfigs(applications);

}

function checkAppDir() {
    if (!FsUtil.isExistSync(dirPath)) {
        fs.mkdirSync(dirPath);
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

    checkAppDir();

    return FsUtil.isExistSync(`${dirPath}/${name}`);

}

function rmPackage(name) {

    if (!name || !hasPackage(name)) {
        return;
    }

    checkAppDir();

    FsUtil.rmRecursionSync(`${dirPath}/${name}`);

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

    formatConfig,
    getConfigs,
    setConfigs,
    isNameExist,
    appendConfig,
    hasPackage,
    savePackage,
    decompressPackage,
    cleanPackage,
    installDependencies

};
