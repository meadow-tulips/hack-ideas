import Service from "../service.js";
import tranformMiddleware from "../transform-middleware.js";

class UserService extends Service {
    constructor(app) {
        super({ base_url: '/user', app })
        this.getAllRoutes();
    }

    getAllRoutes() {
        this.getAuthenticatedUser();
    }

    getAuthenticatedUser () {
        this.app.get('/user', (req, res, next) => {

            const { id } = req.body || {};

            if(!id) {
                res.locals.data = { code: 400 };
                next();
            } else {
                
            }

        })

        this.app.get('/user', tranformMiddleware)

    }
}

export default UserService;