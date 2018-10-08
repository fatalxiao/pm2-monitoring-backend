import fs from 'fs';

function isExistSync(p) {
    try {
        fs.accessSync(p, (fs.constants && fs.constants.F_OK) || fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

export default {
    isExistSync
};
