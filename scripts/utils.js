const fs = require('fs'),
    crypto = require('crypto');

function fsExistsSync(path) {
    try {
        fs.accessSync(path, (fs.constants && fs.constants.F_OK) || fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
};

function copyRecursionSync(src, dist, excludes) {

    const paths = fs.readdirSync(src);

    for (let path of paths) {

        if (excludes && excludes.findIndex(item => path.includes(item)) > -1) {
            continue;
        }

        const srcPath = src + '/' + path,
            distPath = dist + '/' + path,

            stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {

            if (!fsExistsSync(distPath)) {
                fs.mkdirSync(distPath);
            }

            copyRecursionSync(srcPath, distPath, excludes);

        } else {
            fs.copyFileSync(srcPath, distPath);
        }

    }

};

function rmRecursionSync(p) {

    const paths = fs.readdirSync(p);

    for (let path of paths) {

        const rmPath = p + '/' + path,
            stat = fs.statSync(rmPath);

        if (stat.isDirectory()) {
            rmRecursionSync(rmPath);
            if (fsExistsSync(rmPath)) {
                fs.rmdirSync(rmPath);
            }
        } else {
            if (fsExistsSync(rmPath)) {
                fs.unlinkSync(rmPath);
            }
        }

    }

    if (fsExistsSync(p)) {
        fs.rmdirSync(p);
    }

};

function getClientIp(req) {
    return req && ((req.headers && (req.headers['x-real-ip'] || req.headers['x-forwarded-for']))
        || (req.connection && req.connection.remoteAddress)
        || (req.socket && req.socket.remoteAddress)
        || (req.connection && req.connection.socket && req.connection.socket.remoteAddress));
};

function ipParse(ip) {

    if (!ip || !ip.includes(':')) {
        return ip;
    }

    const ipArray = ip.split(':');

    if (!ipArray[3]) {
        return ip;
    }

    return ipArray[3];

}

function calculateSHA256(filePath, callback) {
    const rs = fs.createReadStream(filePath),
        hash = crypto.createHash('sha256');
    rs.on('data', hash.update.bind(hash));
    rs.on('end', function () {
        console.log('SHA-256 Hash: ', hash.digest('hex'), '\n');
        callback && callback();
    });
}

exports.fsExistsSync = fsExistsSync;
exports.copyRecursionSync = copyRecursionSync;
exports.rmRecursionSync = rmRecursionSync;
exports.getClientIp = getClientIp;
exports.ipParse = ipParse;
exports.calculateSHA256 = calculateSHA256;
