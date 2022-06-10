import Service from "../service.js";
import authMiddleware from "../auth-middleware.js";
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore/lite';
import { fireStoreDB } from "../../config.js";
import tranformMiddleware from "../transform-middleware.js";
import { findTagsByName } from "../utils/index.js";

class TagsService extends Service {
    constructor(app) {
        super({ base_url: '/tags', app })
        this.getAllRoutes();
    }

    getAllRoutes() {
        this.getAllTags();
        this.getTagByName();
    }

    getAllTags() {
        this.app.get(this.base_url, authMiddleware, async (req, res, next) => {
            try {
            const _tagsCollection = collection(fireStoreDB, "tags");
            const querySnapshot = await getDocs(_tagsCollection);

            const tags = querySnapshot.docs.map(doc => ({ ...(doc.data())}))
            
            res.locals.data = {
                code: 200, 
                response: tags
            }
        } catch(err) {
            res.locals.data = { code: 500 }
        }

            next();
        }, tranformMiddleware)
    }

    getTagByName() {
        this.app.get(`${this.base_url}/:tagName`, authMiddleware, async (req, res, next) => {
            const { tagName } = req.params || {};
            findTagsByName(tagName)
            .then(({code, querySnapshot }) => {
                res.locals.data = { code, response: querySnapshot.docs.map(qs => qs.data()) };
                next();
            }, val => {
                res.locals.data = val;
                next()
            }).catch(_ => {
                res.locals.data = { code: 500 }
                next()
            })
        }, tranformMiddleware)
    }
}

export default TagsService;