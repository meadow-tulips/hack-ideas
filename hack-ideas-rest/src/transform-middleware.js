const errorMessages = {
    400: "Bad Request",
    500: "Internal Service Error",
    403: "Unauthorized",
    401: "Unauthenticated",
    404: "Entity not found"
}


const onSuccess = (res) => {
    const  { code = 200, status = "SUCCESS", response } = res.locals.data || {}
    return res.status(code).json({ code: code, status, data: response })
}

const onFailure = (res) => {
    const  { code = 400, status = "FAILURE", response } = res.locals.data || {}
    return res.status(code).json({ code: code, status, error: response || errorMessages[code] })
}


const tranformMiddleware = (_, res, next) => {
    const { data } = res.locals || {};
    if(data) {
        if(data.code >= 200 && data.code < 399)
            onSuccess(res);
        else 
            onFailure(res);
    } else
        onFailure();
   next();
}

export default tranformMiddleware