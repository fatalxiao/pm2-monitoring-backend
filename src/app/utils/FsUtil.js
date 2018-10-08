import fs from 'fs';

function isExistSync(p) {
    try {
        fs.accessSync(p, (fs.constants && fs.constants.F_OK) || fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

function rmRecursionSync(p) {

    const paths = fs.readdirSync(p);

    for (let path of paths) {

        const rmPath = p + '/' + path,
            stat = fs.statSync(rmPath);

        if (stat.isDirectory()) {
            rmRecursionSync(rmPath);
            if (isExistSync(rmPath)) {
                fs.rmdirSync(rmPath);
            }
        } else {
            if (isExistSync(rmPath)) {
                fs.unlinkSync(rmPath);
            }
        }

    }

    if (isExistSync(p)) {
        fs.rmdirSync(p);
    }

};

export default {
    isExistSync,
    rmRecursionSync
};
