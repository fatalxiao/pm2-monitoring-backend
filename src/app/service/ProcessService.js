import fs from 'fs';
import path from 'path';
import Response from '../utils/Response.js';

async function getAll() {

    const json = fs.readFileSync(path.resolve(__dirname, '../../processes.json'));

    try {
        const data = JSON.parse(json);
        return Response.buildSuccess(data);
    } catch (e) {
        return Response.buildSuccess([]);
    }

};

async function start(processId) {
    return Response.buildSuccess();
};

export default {
    getAll,
    start
};