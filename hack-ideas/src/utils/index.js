import Cookies from "universal-cookie"

const headers = {
    ['Content-Type']: 'application/json',
    withCredentials: true
}

const post = ({ url, data, headersParams }) => {
    const cookies = new Cookies();
    return fetch(url, { method: "POST", body: JSON.stringify(data), headers: {...headers, ...headersParams}  })
        .then(res => res.json())
}

const get = ({ url, params, headersParams }) => {
    const cookies = new Cookies();
    console.log(cookies.getAll())
    return fetch(url, { method: "GET", headers: {...headers, ...headersParams,} })
        .then(res => res.json())
}

export {
    get,
    post
}