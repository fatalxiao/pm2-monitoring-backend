const REQUEST_METHOD = Symbol('REQUEST_METHOD'),
    REQUEST_ROUTE = Symbol('REQUEST_ROUTE'),

    RequestMethod = {
        GET: 'get',
        POST: 'post',
        PUT: 'put',
        DELETE: 'delete'
    };

const RequestMapping = ({method, value}) => (target, name, descriptor) => {
    descriptor.value[REQUEST_METHOD] = method;
    descriptor.value[REQUEST_ROUTE] = value;
    return descriptor;
};

const GetMapping = ({value}) => (target, name, descriptor) => {
    descriptor.value[REQUEST_METHOD] = RequestMethod.GET;
    descriptor.value[REQUEST_ROUTE] = value;
    return descriptor;
};

const PostMapping = ({value}) => (target, name, descriptor) => {
    descriptor.value[REQUEST_METHOD] = RequestMethod.POST;
    descriptor.value[REQUEST_ROUTE] = value;
    return descriptor;
};

const PutMapping = ({value}) => (target, name, descriptor) => {
    descriptor.value[REQUEST_METHOD] = RequestMethod.PUT;
    descriptor.value[REQUEST_ROUTE] = value;
    return descriptor;
};

const DeleteMapping = ({value}) => (target, name, descriptor) => {
    descriptor.value[REQUEST_METHOD] = RequestMethod.DELETE;
    descriptor.value[REQUEST_ROUTE] = value;
    return descriptor;
};

export {

    REQUEST_METHOD,
    REQUEST_ROUTE,

    RequestMethod,

    RequestMapping,
    GetMapping,
    PostMapping,
    PutMapping,
    DeleteMapping

};