import path from 'path';
import fs from 'fs';

function get() {

    const json = fs.readFileSync(path.resolve(__dirname, '../processes.json'));

    if (!json) {
        return;
    }

    try {
        return JSON.parse(json);
    } catch (e) {
        return;
    }

}

function set(json) {

}

export default {
    get,
    set
};