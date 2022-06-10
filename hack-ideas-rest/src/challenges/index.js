import Service from "../service.js";
import { collection, doc, getDocs, getDoc, addDoc, setDoc, deleteField, query, limit, startAt, orderBy, startAfter, documentId } from 'firebase/firestore/lite';
import { fireStoreDB } from "../../config.js";
import authMiddleware from "../auth-middleware.js";
import tranformMiddleware from "../transform-middleware.js";
import { findTagsByName } from "../utils/index.js";
import paginateMiddleware from "../paginate-middleware.js";

class ChallengesService extends Service {
    constructor(app) {
        super({ base_url: '/challenges', app })
        this.getAllRoutes();
    }

    getAllRoutes() {
        this.getAllChallenges();
        this.postChallenge();
        this.upVoteChallenge();
        this.downVoteChallenge();
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
        this.app.get(this.base_url, authMiddleware, paginateMiddleware, async (_, res, next) => {
            try {
                const paginate = res.locals.filters.paginate

                const firstSnapshot =  await getDocs(query(collection(fireStoreDB, "challenges"), orderBy(documentId()), limit(paginate.limit * ((paginate.page - 1) || 1))))
                let querySnapshot = firstSnapshot;
                if(paginate.page > 1 && firstSnapshot.docs.length > 0) {
                    const lastSnapshot = firstSnapshot.docs[firstSnapshot.docs.length - 1]
                    querySnapshot = await getDocs(query(collection(fireStoreDB, "challenges"), orderBy(documentId()), startAfter(lastSnapshot.id), limit(paginate.limit)))
                }

                const usersData = []
                const tagsData = []
                const votesData = []
                const initialChallengesArray = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    const { user, tags, votes,  ...rest } = data || {};
                    usersData.push(getDoc(user));
                    const eachChallengeTags = tags.map(tag => getDoc(tag));
                    const eachChallengeVotes = Object.keys(votes).map(key => getDoc(votes[key]));
                    tagsData.push(eachChallengeTags);
                    votesData.push(eachChallengeVotes)

                    return {
                        ...rest,
                        id: doc.id
                    }
                });

                const users = await Promise.all(usersData)
                const tags = await Promise.all(tagsData.map(async getTags => await Promise.all(getTags)));
                const votes = await Promise.all(votesData.map(async getVotes => await Promise.all(getVotes)));

                const challenges = initialChallengesArray.map((challenge, index) => ({
                    ...challenge,
                    user: users[index]?.data()?.id, 
                    tags: tags[index]?.map(tag => tag.data()),
                    votes: votes[index]?.length ?? 0
                }))

                res.locals.data = { code: 200, response: challenges }


            } catch (err) {
                res.locals.data = { code: 500 }
            }

            next();
        }, tranformMiddleware)
    }




    upVoteChallenge() {
        this.app.put(`${this.base_url}/:challengeId/upvote`, authMiddleware, async (req, res, next) => {
            const { challengeId } = req.params || {};

            if (!challengeId) {
                res.locals.data = { code: 400, response: "Missing Challenge Id." }
            } else {

                try {

                    const user = req.session.user
                    const documentRef = doc(collection(fireStoreDB, "challenges"), `/${challengeId}`);
                    await setDoc(documentRef, {
                        votes: {
                            [user.id]: doc(collection(fireStoreDB, "users"), `/${user.id}`)
                        },
                    }, { merge: true})
                    
                   res.locals.data = { code: 201 }


                } catch (err) {
                    res.locals.data = { code: 500 }
                }
            }

            next();

        }, tranformMiddleware)

    }

    downVoteChallenge() {
        this.app.put(`${this.base_url}/:challengeId/downvote`, authMiddleware, async (req, res, next) => {
            const { challengeId } = req.params || {};

            if (!challengeId) {
                res.locals.data = { code: 400, response: "Missing Challenge Id." }
            } else {
                try {
                    const user = req.session.user
                    const documentRef = doc(collection(fireStoreDB, "challenges"), `/${challengeId}`);
                    await setDoc(documentRef, {
                        votes: {
                            [user.id]: deleteField()
                        },
                    }, { merge: true })
                    
                   res.locals.data = { code: 201 }

                } catch (err) {
                    res.locals.data = { code: 500 }
                }
            }
            next();
        }, tranformMiddleware)
    }
}

export default ChallengesService;