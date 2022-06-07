const onSuccess = (res) => {
    const  { code = 200, status = "SUCCESS", response } = res.data || {}
    return res.status(code).json({ code: code, status, data: response })
}

const onFailure = (res) => {
    const  { code = 400, status = "FAILURE", response = null } = res.data || {}
    return res.status(code).json({ code: code, status, data: response })
}


const tranformMiddleware = (_, res, next) => {
    const { data = {} } = res.locals || {};
    if(data) {
        if(data.code > 200 && data.code < 399) {
            onSuccess(res);
        } else {
            onFailure(res);
        }
    }
   next();
}

export default tranformMiddleware