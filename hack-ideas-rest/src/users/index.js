import cors from 'cors';
import Service from "../service.js";
import tranformMiddleware from "../transform-middleware.js";
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore/lite';
import { fireStoreDB } from "../../config.js";

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
        this.app.get('/login', async (req, res, next) => {
            if(res.locals.auth) {
                res.locals.data = { code: 200, response: req.session.user }
            } else {
                res.locals.data = { code: 200, response: null }
            }
            next();
        }, tranformMiddleware)
    }

    postAuthenticatedUser() {
        this.app.post(this.base_url, async (req, res, next) => {
            
            const { id } = req.body || {};

            if (!id) {
                res.locals.data = { code: 400 };
                next();
            } else {
                const _usersCollection = collection(fireStoreDB, "users");
                const documentRef = doc(_usersCollection, `/${id}`);
                const documentSnapshot = await getDoc(documentRef);
                const fields = documentSnapshot.data();
                if (fields) {
                    res.locals.data = { code: 200, response: fields }
                    req.session.user = { id }
                } else
                    res.locals.data = { code: 404 }
                next();
            }

        }, tranformMiddleware)
    }
}

export default UserService;