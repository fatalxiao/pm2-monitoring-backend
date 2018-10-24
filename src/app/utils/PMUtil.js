import pm2 from 'pm2';

/**
 * connect pm2
 * @param callback
 * @returns {Promise<any>}
 */
function connect(callback) {
    return new Promise((resolve, reject) => {
        pm2.connect(err => {

            if (err) {
                reject(err);
            }

            callback && callback(resolve, reject);

        });
    });
}

/**
 * get pm2 list info
 * @returns {Promise<any>}
 */
function list() {
    return new Promise((resolve, reject) => {
        pm2.list((err, descriptionList) => {
            if (err) {
                reject(err);
            }
            resolve(descriptionList);
        });
    });
}

/**
 * get application status by id
 * @returns {Promise<any>}
 */
async function getStatusById(id) {
    return new Promise((resolve, reject) => {
        pm2.list((err, descriptionList) => {

            if (err) {
                reject(err);
            }

            const index = descriptionList.findIndex(item => item && item.pm_id === id);

            if (index === -1) {
                reject(`Cannot find Application by ID ${id}`);
            }

            resolve(descriptionList[index].status);

        });
    });
}

/**
 * get application status by name
 * @returns {Promise<any>}
 */
async function getStatusByName(name) {
    return new Promise((resolve, reject) => {
        pm2.list((err, descriptionList) => {

            if (err) {
                reject(err);
            }

            const index = descriptionList.findIndex(item => item && item.name === name);

            if (index === -1) {
                reject(`Cannot find Application by name ${name}`);
            }

            resolve(descriptionList[index].status);

        });
    });
}

/**
 * start app application
 * @param options
 * @returns {Promise<any>}
 */
function start(options) {

    if (!options) {
        return;
    }

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
 * stop application by application id
 * @param id
 * @returns {Promise<any>}
 */
function stopById(id) {

    if (id == undefined) {
        return;
    }

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
 * stop application by application name
 * @param name
 * @returns {Promise<any>}
 */
function stopByName(name) {

    if (name == undefined) {
        return;
    }

    return connect((resolve, reject) => {
        pm2.stop(name, (err, proc) => {

            pm2.disconnect();

            if (err) {
                reject(err);
            }

            resolve(proc);

        });
    });

}

/**
 * stop all app applications
 * @param id
 * @returns {Promise<any>}
 */
function stopAll() {
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
 * restart application by id
 * @param id
 * @returns {Promise<any>}
 */
function restartById(id) {

    if (id == undefined) {
        return;
    }

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
 * restart all app applications
 * @param id
 * @returns {Promise<any>}
 */
function restartAll() {
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
 * delete application by id
 * @param id
 * @returns {Promise<any>}
 */
function deleteById(id) {

    if (id == undefined) {
        return;
    }

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
 * delete all app applications
 * @param id
 * @returns {Promise<any>}
 */
function deleteAll() {
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
 * reload application by id
 * @param id
 * @returns {Promise<any>}
 */
function reloadById(id) {

    if (id == undefined) {
        return;
    }

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
 * reload all app applications
 * @param id
 * @returns {Promise<any>}
 */
function reloadAll() {
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

export default {
    connect,
    list,
    getStatusById,
    getStatusByName,
    start,
    stopById,
    stopByName,
    stopAll,
    restartById,
    restartAll,
    deleteById,
    deleteAll,
    reloadById,
    reloadAll
};
