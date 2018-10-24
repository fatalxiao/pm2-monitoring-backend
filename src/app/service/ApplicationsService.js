import Response from '../utils/Response.js';
import ApplicationsUtil from '../utils/ApplicationUtil.js';

async function getApplications() {
    try {
        const applications = await ApplicationsUtil.getApplications();
        return Response.buildSuccess(applications);
    } catch (e) {
        return Response.buildError('Get Application List Failed');
    }
};

export default {
    getApplications
};
