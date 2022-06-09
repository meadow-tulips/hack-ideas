import Service from "../service.js";
import authMiddleware from "../auth-middleware.js";
import { collection, doc, getDoc, getDocs } from 'firebase/firestore/lite';
import { fireStoreDB } from "../../config.js";
import tranformMiddleware from "../transform-middleware.js";

class UserService extends Service {
    constructor(app) {
        super({ base_url: '/login', app })
        this.getAllRoutes();
    }

    getAllRoutes() {
        this.getAuthenticatedUser();
        this.postAuthenticatedUser();
    }

    getAuthenticatedUser () {
        this.app.get(this.base_url, authMiddleware, async (req, res, next) => {
            res.locals.data = { code: 200, response: req.session.user }
            next();
        }, tranformMiddleware)
    }

    postAuthenticatedUser() {
        this.app.post(this.base_url, async (req, res, next) => {
            
            const { id } = req.body || {};

            if (!id) {
                res.locals.data = { code: 400 };
            } else {
                const _usersCollection = collection(fireStoreDB, "users");
                const documentRef = doc(_usersCollection, `/${id}`);
                const documentSnapshot = await getDoc(documentRef);
                const fields = documentSnapshot.data();
                if (fields) {
                    res.locals.data = { code: 200, response: fields }
                    req.session.user = { id }
                } else
                    res.locals.data = { code: 404, response: "No user found." }
            }
            next();
        }, tranformMiddleware)
    }
}

export default UserService;