import path from 'path';
import fs from 'fs';
import {exec} from 'child_process';

export function getApplicationsConfig() {

    const json = fs.readFileSync(path.resolve(__dirname, '../../applications.json'));

    if (!json) {
        return;
    }

    try {
        return JSON.parse(json);
    } catch (e) {
        return;
    }

}

export function setApplicationsConfig(json) {

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
