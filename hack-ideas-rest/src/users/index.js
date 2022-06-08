import Service from "../service.js";
import tranformMiddleware from "../transform-middleware.js";
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore/lite';
import { fireStoreDB } from "../../config.js";

class UserService extends Service {
    constructor(app) {
        super({ base_url: '/user', app })
        this.getAllRoutes();
    }

    getAllRoutes() {
        this.getAuthenticatedUser();
    }

    getAuthenticatedUser() {
        this.app.post('/user', async (req, res, next) => {
            
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
                    res.locals.data = { code: 200, response: {...fields, sessionId: req.sessionID } }
                    req.session.user = { id }
                } else
                    res.locals.data = { code: 404 }
                next();
            }

        })

        this.app.post('/user', tranformMiddleware)

    }
}

export default UserService;