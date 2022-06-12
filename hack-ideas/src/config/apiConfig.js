
const EXPRESS_URL = process.env.REACT_APP_EXPRESS_SERVER

const API = {
    LOGIN: EXPRESS_URL + "/login",
    CHALLENGES: EXPRESS_URL + "/challenges",
    TAGS: EXPRESS_URL + "/tags"
}

export default API;