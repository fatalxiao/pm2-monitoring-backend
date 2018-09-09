import pm2 from 'pm2';

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

export function startApp(config) {
    return new Promise((resolve, reject) => {
        pm2.connect(err => {

            if (err) {
                reject(err);
            }

            pm2.start(config, (err, apps) => {

                pm2.disconnect();

                if (err) {
                    reject(err);
                }

                resolve(apps);

            });

        });
    });
}