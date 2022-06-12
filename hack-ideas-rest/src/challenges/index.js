import Service from "../service.js";
import { collection, doc, getDocs, getDoc, addDoc, setDoc, query, limit, orderBy, startAfter, documentId, Timestamp, serverTimestamp } from 'firebase/firestore/lite';
import { fireStoreDB } from "../../config.js";
import authMiddleware from "../auth-middleware.js";
import tranformMiddleware from "../transform-middleware.js";
import { findTagsByName, countTotalVotes, constructChallengesFromDocs, sortByVoteCounts } from "../utils/index.js";
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
        this.getChallengeById();
    }

    postChallenge() {
        this.app.post(`${this.base_url}/add`, authMiddleware, async (req, res, next) => {

            const { title, description, tags = [] } = req.body || {};

            if (!title || !description) {
                res.locals.data = { code: 400, response: "Missing Title or Description !" }
                next();
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
                                    votes: {},
                                    user: documentRef,
                                    createdOn: serverTimestamp(),
                                    tags: querySnapshot.docs.map(qs => qs.ref)
                                })

                                const recentlyAddedData = (await getDoc(newlyAddedChallenge)).data()
                                const { votes, user, tags, ...rest } = recentlyAddedData;

                                res.locals.data = {
                                    code: 201, response: {
                                        ...rest, votes: { total: 0, ownVote: "0" }, user: user.id, id: newlyAddedChallenge.id, tags: querySnapshot.docs.map(qs => qs.data())
                                    }
                                }
                                next();
                            }, ({ code, response }) => {
                                res.locals.data = {
                                    code, response
                                }
                                next();
                            }).catch(err => {
                                // could be some code error
                                res.locals.data = { code: 500 }
                                next();
                            })
                    } else {
                        const createdOn = serverTimestamp()
                        const newlyAddedChallenge = await addDoc(_challengesCollection, {
                            title,
                            description,
                            votes: {},
                            user: documentRef,
                            createdOn,
                            tags: []
                        })

                        const recentlyAddedData = (await getDoc(newlyAddedChallenge)).data()
                        const { votes, user, tags, ...rest } = recentlyAddedData;

                        res.locals.data = {
                            code: 201, response: {
                                ...rest, votes: { total: 0, ownVote: "0" }, user: user.id, id: newlyAddedChallenge.id, tags: []
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
        this.app.get(this.base_url, authMiddleware, paginateMiddleware, async (req, res, next) => {
            try {
                const paginate = res.locals.filters.paginate
                const sort = res.locals.filters.sort
                if (sort.field === 'votes') {
                    const sortedDocs = await sortByVoteCounts(sort.direction);
                    let challenges = await constructChallengesFromDocs(sortedDocs, req.session.user.id);
                    let filteredPaginatedChallenges = challenges;
                    if(paginate.page === 1 && challenges?.length > 0) {
                        filteredPaginatedChallenges = challenges.slice(0, paginate.limit);
                    } else if(paginate.page > 1 && challenges?.length > 0) {
                        const excludeLimit = paginate.limit * (paginate.page - 1);
                        filteredPaginatedChallenges = challenges.slice(excludeLimit, excludeLimit + paginate.limit);
                    }

                    res.locals.data = { code: 200, response: filteredPaginatedChallenges }
                } else {

                    const firstSnapshot = await getDocs(query(collection(fireStoreDB, "challenges"), orderBy(sort.field, sort.direction), limit(paginate.limit * ((paginate.page - 1) || 1))))
                    let querySnapshot = firstSnapshot;
                    if (paginate.page > 1 && firstSnapshot.docs.length > 0) {
                        const lastSnapshot = firstSnapshot.docs[firstSnapshot.docs.length - 1]
                        querySnapshot = await getDocs(query(collection(fireStoreDB, "challenges"), orderBy(sort.field, sort.direction), startAfter(lastSnapshot.data()[sort.field]), limit(paginate.limit)))
                    }

                    const challenges = await constructChallengesFromDocs(querySnapshot.docs, req.session.user.id);

                    res.locals.data = { code: 200, response: challenges }
                }


            } catch (err) {
                res.locals.data = { code: 500 }
                next()
            }

            next()


        }, tranformMiddleware)
    }




    upVoteChallenge() {
        this.app.put(`${this.base_url}/:challengeId/upvote`, authMiddleware, async (req, res, next) => {
            const { challengeId } = req.params || {};

            if (!challengeId) {
                res.locals.data = { code: 400, response: "Missing Challenge Id !" }
            } else {

                try {

                    const user = req.session.user
                    const documentRef = doc(collection(fireStoreDB, "challenges"), `/${challengeId}`);
                    const documentData = (await getDoc(documentRef)).data();
                    const newVotesMap = {
                        ...documentData.votes,
                        [user.id]: documentData.votes[user.id] === "-1" ? '0' : '1'
                    }

                    await setDoc(documentRef, {
                        votes: newVotesMap
                    }, { merge: true })

                    res.locals.data = { code: 201, response: { votes: { total: countTotalVotes(newVotesMap), ownVote: newVotesMap[user.id] } } }
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
                res.locals.data = { code: 400, response: "Missing Challenge Id !" }
            } else {
                try {
                    const user = req.session.user
                    const documentRef = doc(collection(fireStoreDB, "challenges"), `/${challengeId}`);
                    const documentData = (await getDoc(documentRef)).data();
                    const newVotesMap = {
                        ...documentData.votes,
                        [user.id]: documentData.votes[user.id] === '1' ? '0' : '-1'
                    }

                    await setDoc(documentRef, {
                        votes: newVotesMap
                    }, { merge: true })

                    res.locals.data = { code: 201, response: { votes: { total: countTotalVotes(newVotesMap), ownVote: newVotesMap[user.id] } } }
                } catch (err) {
                    res.locals.data = { code: 500 }
                }
            }
            next();
        }, tranformMiddleware)
    }





    getChallengeById() {
        this.app.get(`${this.base_url}/:challengeId`, authMiddleware, async (req, res, next) => {
            const { challengeId } = req.params || {};
            if (!challengeId) {
                res.locals.data = { code: 400, response: "Missing Challenge Id !" }
            } else {
                try {
                    const _challengesCollection = collection(fireStoreDB, "challenges");
                    const documentRef = doc(_challengesCollection, `/${challengeId}`);
                    const documentSnapshot = await getDoc(documentRef);
                    const fields = documentSnapshot.data();
                    if (fields) {
                        const { user, tags, votes, ...rest } = fields || {}

                        const createdUserInfo = (await getDoc(user)).data();
                        const tagsDataSnapshotPromises = tags.map(eachTagDoc => getDoc(eachTagDoc));
                        const userVotesSnapshotPromises = Object.keys(votes).map(user => getDoc(doc(collection(fireStoreDB, "users"), `/${user}`)), {})

                        const tagsInfo = await Promise.all(tagsDataSnapshotPromises);
                        const userVotesInfo = await Promise.all(userVotesSnapshotPromises);

                        const votesInfo = userVotesInfo.reduce((acc, userVoter) => {
                            if (userVoter.data()) {
                                const userVoterData = userVoter.data();
                                if (userVoterData.id === req.session.user.id) {
                                    acc.ownVote = votes[userVoterData.id]
                                }
                                if (votes[userVoterData.id] === "1") {
                                    acc.total += 1;
                                } else if (votes[userVoterData.id] === "-1") {
                                    acc.total -= 1;
                                }
                            }
                            return acc;
                        }, { total: 0, ownVote: "0" })


                        const challengesDetails = {
                            ...rest,
                            tags: tagsInfo.map(tag => tag.data()),
                            user: createdUserInfo,
                            votes: votesInfo,
                            id: documentRef.id
                        }

                        res.locals.data = { code: 200, response: challengesDetails }

                    } else
                        res.locals.data = { code: 404, response: "No Challenge found !" }
                } catch (err) {
                    res.locals.data = { code: 500 }
                }
            }

            next();
        }, tranformMiddleware)
    }
}

export default ChallengesService;