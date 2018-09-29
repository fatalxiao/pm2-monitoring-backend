import pm2 from 'pm2';

/**
 * connect pm2
 * @param callback
 * @returns {Promise<any>}
 */
function connect(callback) {
    return new Promise((resolve, reject) => {

        if (id == undefined) {
            reject();
        }

        pm2.connect(err => {

            if (err) {
                reject(err);
            }

            callback(resolve, reject);

        });
    });
}

/**
 * get pm2 list info
 * @returns {Promise<any>}
 */
export function getPMList() {
    return new Promise((resolve, reject) => {
        pm2.list((err, processDescriptionList) => {
            if (err) {
                reject(err);
            }
            resolve(processDescriptionList);
        });
    });
}

/**
 * start app process
 * @param options
 * @returns {Promise<any>}
 */
export function start(options) {
    return connect((resolve, reject) => {
        pm2.start(options, (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });
}

/**
 * stop app process by process id
 * @param id
 * @returns {Promise<any>}
 */
export function stopById(id) {
    return connect((resolve, reject) => {
        pm2.stop(id, (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });
}

/**
 * stop all app processes
 * @param id
 * @returns {Promise<any>}
 */
export function stopAll() {
    return connect((resolve, reject) => {
        pm2.stop('all', (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });
}

/**
 * restart app process by process id
 * @param id
 * @returns {Promise<any>}
 */
export function restartById(id) {
    return connect((resolve, reject) => {
        pm2.restart(id, (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });
}

/**
 * restart all app processes
 * @param id
 * @returns {Promise<any>}
 */
export function restartAll() {
    return connect((resolve, reject) => {
        pm2.restart('all', (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });
}

/**
 * delete app process by process id
 * @param id
 * @returns {Promise<any>}
 */
export function delById(id) {
    return connect((resolve, reject) => {
        pm2.delete(id, (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });
}

/**
 * delete all app processes
 * @param id
 * @returns {Promise<any>}
 */
export function delAll() {
    return connect((resolve, reject) => {
        pm2.delete('all', (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });
}

/**
 * reload app process by process id
 * @param id
 * @returns {Promise<any>}
 */
export function reloadById(id) {
    return connect((resolve, reject) => {
        pm2.reload(id, (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });
}

/**
 * reload all app processes
 * @param id
 * @returns {Promise<any>}
 */
export function reloadAll() {
    return connect((resolve, reject) => {
        pm2.reload('all', (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });
}
