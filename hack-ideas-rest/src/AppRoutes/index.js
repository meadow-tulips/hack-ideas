import UserService from "../users/index.js";
import ChallengesService from "../challenges/index.js";
import TagsService from "../tags/index.js";

class AppRoutes {
    constructor(app) {
        this.initiateServices(app);
    }

    initiateServices(app) {
        new UserService(app);
        new ChallengesService(app);
        new TagsService(app);
    }
}

export default AppRoutes;