import path from 'path';
import fs from 'fs';
import FsUtil from './FsUtil';
import {exec} from 'child_process';
import yauzl from 'yauzl';

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
    env: '',
    envProd: ''
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
        port: finalConfig.port,
        env: {
            NODE_ENV: finalConfig.env
        },
        env_production: {
            NODE_ENV: finalConfig.envProd
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

    const reader = fs.createReadStream(file.path),
        filePath = path.resolve(__dirname, `../../pm2-apps/${name}.zip`),
        writer = fs.createWriteStream(filePath);

    reader.pipe(writer);

}

function decompressPackage(name, file) {

    if (!name || !file) {
        return;
    }

    rmPackage(name);

    yauzl.open(path.resolve(__dirname, `../../pm2-apps/${name}.zip`), (err, zipfile) => {

        if (err) {
            throw err;
        }

        zipfile.on('error', err => {
            throw err;
        });

        zipfile.on('entry', entry => {

            if (!dumpContents || /\/$/.exec(entry)) {
                return;
            }

            zipfile.openReadStream(entry, (err, readStream) => {
                if (err) {
                    throw err;
                }
                readStream.pipe(path.resolve(__dirname, '../../pm2-apps'));
            });

        });
    });

}

/**
 * install node dependencies
 */
function installDependencies() {
    exec('npm i -d', {
        cwd: path.resolve(__dirname, '../../pm2-apps/alcedo-ui/')
    }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
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
    installDependencies

};
