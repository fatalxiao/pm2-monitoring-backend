const fs = require('fs'),
    archiver = require('archiver'),
    crypto = require('crypto'),
    log = require('friendly-errors-webpack-plugin/src/output'),

    {fsExistsSync, copyRecursionSync, rmRecursionSync} = require('./utils.js'),

    name = 'pm2-monitoring-backend',
    path = `./${name}`,
    zipPath = `./${name}.zip`;

log.title('info', 'WAIT', 'Building Zip...');

// remove zip file
if (fsExistsSync(zipPath)) {
    fs.unlinkSync(zipPath);
}

// remove temp dir
if (fsExistsSync(path)) {
    rmRecursionSync(path);
}

// make temp dir
fs.mkdirSync(path);

// copy files
copyRecursionSync('dist', path, ['node_modules', '.DS_Store']);
copyRecursionSync('./build/release', path);

// make archive
const output = fs.createWriteStream(zipPath),
    archive = archiver('zip', {zlib: {level: 9}});

output.on('close', () => {

    // remove temp dir
    if (fsExistsSync(path)) {
        rmRecursionSync(path);
    }

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
archive.directory(path, name);
archive.finalize();
