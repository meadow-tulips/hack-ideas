import { collection, where, getDocs, query, getDoc, doc } from "firebase/firestore/lite";
import { fireStoreDB } from "../../config.js";


const findTagsByName = async (tags) => {
    if(!tags ||  (Array.isArray(tags) && !tags.length)) {
        return Promise.reject({ code: 400, response: "Bad Request" });
    } else {
        const _tagsCollection = collection(fireStoreDB, "tags")
        const whereQuery = Array.isArray(tags) ? where('name', 'in', tags) : where('name', '==', tags);
        const querySnapshot = await getDocs(query(_tagsCollection, whereQuery));
        if(querySnapshot.docs.length > 0) {
            return Promise.resolve({  code: 200, querySnapshot });
        } else {
            return Promise.reject({ code: 404, response: "No tags found" });
        }
    }
}


const countTotalVotes = (votesMap) => {
    return Object.keys(votesMap || {}).reduce((totalVotes, userId) => {
        if (votesMap[userId] === '-1') {
            totalVotes -= 1;
        } else if (votesMap[userId] === '1') {
            totalVotes += 1;
        }
        return totalVotes;
    }, 0);
}

const sortByVoteCounts = async (direction) => {
    const _challengesCollection = collection(fireStoreDB, 'challenges')
    const docsSnaphots = await getDocs(_challengesCollection);
    const dictionary = {};
    const allDocumentsData = docsSnaphots.docs.map(doc => {
        dictionary[doc.id] = doc
        return doc.data();
    });



    const votesDocs = allDocumentsData.map((doc, index) => {
        return {[docsSnaphots.docs[index].id]:  countTotalVotes(doc.votes) }
    })

    const sortedVotesDocs = votesDocs.sort((a, b) => {
        return  Object.values(a)[0] > Object.values(b)[0] ? direction === 'desc' ? -1 : 1 : Object.values(a)[0] < Object.values(b)[0] ? direction === 'desc' ? 1 : -1 : 0
    })

   return sortedVotesDocs.map(item => {
        return dictionary[Object.keys(item)[0]]
    })
    
}


const constructChallengesFromDocs = async (snapshotsDocs, loginUser) => {
    const usersData = []
    const tagsData = []
    const votesData = []
    const challengesUsersVotesMap = {}
    const initialChallengesArray = snapshotsDocs.map((eachDoc, index) => {
        const data = eachDoc.data();
        const { user, tags, votes, ...rest } = data || {};
        usersData.push(getDoc(user));
        const eachChallengeTags = tags.map(tag => getDoc(tag));
        const eachChallengeVotes = Object.keys(votes).map(key => {
            challengesUsersVotesMap[index] = { ...challengesUsersVotesMap[index], [key]: votes[key] }
            return getDoc(doc(collection(fireStoreDB, "users"), `/${key}`))
        });
        tagsData.push(eachChallengeTags);
        votesData.push(eachChallengeVotes)
        return {
            ...rest,
            id: eachDoc.id
        }
    });

    const users = await Promise.all(usersData)
    const tags = await Promise.all(tagsData.map(async getTags => await Promise.all(getTags)));
    const votes = await Promise.all(votesData.map(async v => await Promise.all(v)));
    const challenges = initialChallengesArray.map((challenge, index) => { 
        const contructedVotesData = votes[index].reduce((acc, eachUser) => {
            if (eachUser.data()) {
                const { id } = eachUser.data()
                if(id === loginUser) {
                    acc['ownVote'] = challengesUsersVotesMap[index][id];
                }

                if (challengesUsersVotesMap[index][id] === '-1') {
                    acc['total'] -= 1;
                } else if (challengesUsersVotesMap[index][id] === '1') {
                    acc['total'] += 1;
                }
            }
            return acc
        }, { total: 0, ownVote: "0"})
        return ({
        ...challenge,
        user: users[index]?.data()?.id,
        tags: tags[index]?.map(tag => tag.data()),
        votes: contructedVotesData
    })})

    return challenges;
}



export {
    findTagsByName,
    countTotalVotes,
    sortByVoteCounts,
    constructChallengesFromDocs
}