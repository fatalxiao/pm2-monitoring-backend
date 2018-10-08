import Response from '../utils/Response.js';
import ApplicationsUtil from '../utils/ApplicationsUtil.js';
import PMUtil from '../utils/PMUtil.js';

async function getApplications() {

    try {

        const data = ApplicationsUtil.getApplicationsConfig();

        if (!data) {
            return Response.buildSuccess([]);
        }

        // get pm2 list data
        const processList = await PMUtil.list();

        return Response.buildSuccess(data.filter(item => item).map(item => {
            const index = processList.findIndex(p => p && p.name === item.name);
            return index === -1 ? item : {
                ...item,
                pid: processList[index].pid,
                pm_id: processList[index].pm_id,
                status: processList[index].pm2_env.status,
                monit: processList[index].monit
            };
        }));

    } catch (e) {
        return Response.buildError('Get Application List Failed');
    }

};

export default {
    getApplications
};
