const Mappings = {

    SUCCESS: [2000, 'Success'],

    ERROR: [4000, 'Error'],
    PARAM_INCORRECT: [4001, 'Param Incorrect']

};

function build([code, message], data) {

    const json = {
        code,
        message
    };

    json.data = data || '';

    return JSON.stringify(json);

}

function buildSuccess(data) {
    return build(Mappings.SUCCESS, data);
}

function buildError(data) {
    return build(Mappings.ERROR, data);
}

function buildParamError(data) {
    return build(Mappings.PARAM_INCORRECT, data);
}

export default {
    build,
    buildSuccess,
    buildError,
    buildParamError
};
