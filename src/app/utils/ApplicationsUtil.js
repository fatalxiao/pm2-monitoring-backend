import path from 'path';
import fs from 'fs';
import FsUtil from './FsUtil';
import {exec} from 'child_process';
import unzip from 'unzip-stream';

const filePath = path.resolve(__dirname, '../../applications.json');

/**
 * default application config
 * @type {{name: string, description: string, instances: number, script: string, port: string, env: string, envProd: string}}
 */
const DEFAULT_CONFIG = {
    name: '',
    description: '',
    instances: 1,
    script: '',
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

    const finalConfig = {...DEFAULT_CONFIG, ...config};

    return {
        name: finalConfig.name,
        script: finalConfig.script,
        instances: finalConfig.instances,
        env: {
            NODE_ENV: finalConfig.env,
            NODE_PORT: finalConfig.port ? +finalConfig.port : ''
        },
        description: finalConfig.description
    };

}

/**
 * read applications config in file <applications.json>
 * @returns {any}
 */
function getConfigs() {

    try {

        const json = fs.readFileSync(filePath);

        if (!json) {
            return [];
        }

        return JSON.parse(json);

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
        return fs.writeFileSync(filePath, JSON.stringify(config));
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

/**
 * check the application has package or not
 * @param name
 * @returns {boolean}
 */
function hasPackage(name) {

    if (!name) {
        return false;
    }

    return FsUtil.isExistSync(path.resolve(__dirname, `../../pm2-apps/${name}`));

}

function rmPackage(name) {

    if (!name || !hasPackage(name)) {
        return;
    }

    FsUtil.rmRecursionSync(path.resolve(__dirname, `../../pm2-apps/${name}`));

}

function savePackage(name, file) {
    return new Promise(resolve => {

        const reader = fs.createReadStream(file.path),
            filePath = path.resolve(__dirname, `../../pm2-apps/${name}.zip`),
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

        rmPackage(name);

        const dirPath = path.resolve(__dirname, `../../pm2-apps/${name}`),
            filePath = path.resolve(__dirname, `../../pm2-apps/${name}.zip`),
            reader = fs.createReadStream(filePath);

        reader.pipe(unzip.Extract({
            path: dirPath
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

        const dirPath = path.resolve(__dirname, `../../pm2-apps/${name}`),
            paths = fs.readdirSync(dirPath);

        if (paths && paths.length === 1 && fs.statSync(`${dirPath}/${paths[0]}`).isDirectory()) {
            FsUtil.copyRecursionSync(`${dirPath}/${paths[0]}`, dirPath);
            FsUtil.rmRecursionSync(`${dirPath}/${paths[0]}`);
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

        exec('npm i -d', {
            cwd: path.resolve(__dirname, `../../pm2-apps/${name}`)
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
