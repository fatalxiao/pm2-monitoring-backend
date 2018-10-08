import path from 'path';
import fs from 'fs';
import {exec} from 'child_process';

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
function getApplicationsConfig() {

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
function setApplicationsConfig(config) {

    if (!config) {
        return;
    }

    try {
        return fs.writeFileSync(filePath, JSON.stringify(config));
    } catch (e) {
        return;
    }

}

function isApplicationNameExist(name) {

    if (!name) {
        return false;
    }

    const applications = getApplicationsConfig();

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
function appendApplicationConfig(config) {

    if (!config || !config.name) {
        return;
    }

    const applications = getApplicationsConfig();
    applications.push(formatConfig(config));

    return setApplicationsConfig(applications);

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
    getApplicationsConfig,
    setApplicationsConfig,
    isApplicationNameExist,
    appendApplicationConfig,
    installDependencies

};
