class Service {
    constructor({ base_url, app }) {
        this.base_url = base_url 
        this.app = app
    }

    getAllRoutes() {
        // This method must be overwritten in derived classes

    }
}

export default Service;