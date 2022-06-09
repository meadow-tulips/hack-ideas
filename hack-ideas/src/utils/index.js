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
        .catch(err => err)
}

const get = ({ url, params, headersParams }) => {
    return fetch(url, { method: "GET", credentials: 'include', headers: { ...headers, ...headersParams } })
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                return Promise.reject(res);
            } else {
                return res
            }
        })
        .catch(err => {
            throw err
        })
}

export {
    get,
    post
}