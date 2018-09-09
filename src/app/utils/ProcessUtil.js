import path from 'path';
import fs from 'fs';

export function getProcessesConfig() {

    const json = fs.readFileSync(path.resolve(__dirname, '../../processes.json'));

    if (!json) {
        return;
    }

    try {
        return JSON.parse(json);
    } catch (e) {
        return;
    }

}

export function setProcessesConfig(json) {

}