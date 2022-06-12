const headers = {
    'Content-Type': 'application/json',
    "withCredentials": true
}

const post = ({ url, data, headersParams }) => {
    return fetch(url, { method: "POST", credentials: 'include', body: JSON.stringify(data), headers: { ...headers, ...headersParams } })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                return Promise.reject(res);
            } else {
                return res
            }
        })
}

const get = ({ url, queryParams = {}, headersParams }) => {
    const params = Object.keys(queryParams).length > 0 ? Object.keys(queryParams).reduce((params, key, index) => index === 0 ? params + `?${key}=${queryParams[key]}`: params + `&${key}=${queryParams[key]}`, ""): "";
    return fetch(url + params, { method: "GET", credentials: 'include', headers: { ...headers, ...headersParams } })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                return Promise.reject(res);
            } else {
                return res
            }
        })
}

const put = ({ url, data, headersParams }) => {
    return fetch(url, { method: "PUT", credentials: 'include', body: JSON.stringify(data), headers: { ...headers, ...headersParams } })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                return Promise.reject(res);
            } else {
                return res
            }
        })
}

export {
    get,
    post,
    put
}