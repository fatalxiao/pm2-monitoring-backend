const fs = require('fs'),
    archiver = require('archiver'),
    crypto = require('crypto'),
    log = require('friendly-errors-webpack-plugin/src/output'),

    name = 'pm2-monitoring-backend',
    distPath = `./dist`,
    zipPath = `./${name}.zip`;

function fsExistsSync(p) {
    try {
        fs.accessSync(p, (fs.constants && fs.constants.F_OK) || fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
};

log.title('info', 'WAIT', 'Building Zip...');

// remove zip file
if (fsExistsSync(zipPath)) {
    fs.unlinkSync(zipPath);
}

// make archive
const output = fs.createWriteStream(zipPath),
    archive = archiver('zip', {zlib: {level: 9}});

output.on('close', () => {

    // calculate SHA-256 Hash
    const rs = fs.createReadStream(zipPath),
        hash = crypto.createHash('sha256');

    rs.on('data', hash.update.bind(hash));
    rs.on('end', () => {
        log.title('success', 'DONE', [
            'Build Zip complete',
            `Archive: ${archive.pointer()} total bytes`,
            `SHA-256 Hash: ${hash.digest('hex')}`
        ].join('\n       '));
    });

});
archive.pipe(output);
archive.directory(distPath, false);
archive.finalize();
