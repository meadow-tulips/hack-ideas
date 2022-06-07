import UserService from "../users/index.js";

class AppRoutes {
    constructor(app) {
        this.initiateServices(app);
    }

    initiateServices(app) {
        new UserService(app);
    }
}

export default AppRoutes;