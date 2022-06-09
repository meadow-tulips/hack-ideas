import Service from "../service.js";
import { collection, doc, getDocs, getDoc, addDoc } from 'firebase/firestore/lite';
import { fireStoreDB } from "../../config.js";
import authMiddleware from "../auth-middleware.js";
import tranformMiddleware from "../transform-middleware.js";
import { findTagsByName } from "../utils/index.js";

class ChallengesService extends Service {
    constructor(app) {
        super({ base_url: '/challenges', app })
        this.getAllRoutes();
    }

    getAllRoutes() {
        this.getAllChallenges();
        this.postChallenge();
    }

    postChallenge() {
        this.app.post(`${this.base_url}/add`, authMiddleware, async (req, res, next) => {

            const { title, description, tags = [] } = req.body || {};

            if (!title || !description) {
                res.locals.data = { code: 400, response: "Missing Title or Description" }
            } else {
                try {
                    const user = req.session.user
                    const _usersCollection = collection(fireStoreDB, "users");
                    const documentRef = doc(_usersCollection, `/${user.id}`);

                    const _challengesCollection = collection(fireStoreDB, "challenges");

                    if (tags.length > 0) {
                        findTagsByName(tags)
                            .then(async ({ querySnapshot }) => {

                                const newlyAddedChallenge = await addDoc(_challengesCollection, {
                                    title,
                                    description,
                                    votes: 0,
                                    user: documentRef,
                                    tags: querySnapshot.docs.map(qs => qs.ref)
                                })


                                res.locals.data = {
                                    code: 201, response: {
                                        title, description, votes: 0, user: user.id, id: newlyAddedChallenge.id, tags: querySnapshot.docs.map(qs => qs.data())
                                    }
                                }
                                next();
                            }, ({ code, response }) => {
                                res.locals.data = {
                                    code, response
                                }
                                next();
                            }).catch(_ => {
                                // could be some code error
                                res.locals.data = { code: 500 }
                                next();
                            })
                    } else {
                        const newlyAddedChallenge = await addDoc(_challengesCollection, {
                            title,
                            description,
                            votes: 0,
                            user: documentRef,
                            tags: []
                        })

                        res.locals.data = {
                            code: 201, response: {
                                title, description, votes: 0, user: user.id, id: newlyAddedChallenge.id, tags: []
                            }
                        }

                        next();
                    }

                } catch (err) {
                    res.locals.data = { code: 500 }
                    next();
                }
            }
        }, tranformMiddleware)
    }

    getAllChallenges() {
        this.app.get(this.base_url, authMiddleware, async (req, res, next) => {
            try {
                const querySnapshot = await getDocs(collection(fireStoreDB, "challenges"));
                const usersData = []
                const tagsData = []
                const initialChallengesArray = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    const { user, tags, ...rest } = data || {};
                    usersData.push(getDoc(user));
                    const eachUserTags = tags.map(tag => getDoc(tag));
                    tagsData.push(eachUserTags);
                    return {
                        ...rest,
                        id: doc.id
                    }
                });

                const users = await Promise.all(usersData)
                const tags = await Promise.all(tagsData.map(async data => await Promise.all(data)));

                const challenges = initialChallengesArray.map((challenge, index) => ({
                    ...challenge,
                    user: users[index]?.data()?.id, tags: tags[index]?.map(tag => tag.data())
                }))

                res.locals.data = { code: 200, response: challenges }


            } catch (err) {
                res.locals.data = { code: 500 }
            }

            next();
        }, tranformMiddleware)
    }
}

export default ChallengesService;