import moment from 'moment';

function duration(t1, t2, format = 'YYYY-MM-DD HH:mm:ss') {

    if (!t1 || !t2) {
        return -1;
    }

    const time1 = moment(t1, format),
        time2 = moment(t2, format);

    if (!time1.isValid() || !time2.isValid()) {
        return -1;
    }

    return Math.abs(+time1 - +time2);

}

function getCurrentTime(format = 'YYYY-MM-DD HH:mm:ss') {
    return moment.utc().format(format);
}

export default {
    duration,
    getCurrentTime
};
