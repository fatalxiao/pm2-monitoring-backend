import path from 'path';
import fs from 'fs';
import {exec} from 'child_process';

const filePath = path.resolve(__dirname, '../../applications.json');

export const DEFAULT_CONFIG = {
    name: '',
    description: '',
    instances: 1,
    script: '',
    port: '',
    env: '',
    envProd: ''
};

export function formatConfig(config) {

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

export function getApplicationsConfig() {

    try {

        const json = fs.readFileSync(filePath);

        if (!json) {
            return;
        }

        return JSON.parse(json);

    } catch (e) {
        return;
    }

}

export function setApplicationsConfig(config) {

    if (!config) {
        return;
    }

    try {
        return fs.writeFileSync(filePath, JSON.stringify(config));
    } catch (e) {
        return;
    }

}

export function appendApplicationConfig(config) {

    if (!config) {
        return;
    }

    const json = fs.readFileSync(filePath);
    let applications;

    try {
        applications = JSON.parse(json);
    } catch (e) {
        applications = [];
    }

    applications.push(formatConfig(config));

    return setApplicationsConfig(applications);

}

export function installDependencies() {
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
