import path from 'path';
import fs from 'fs';

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
