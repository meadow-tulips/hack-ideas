import { collection, where, getDocs, query } from "firebase/firestore/lite";
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

export {
    findTagsByName
}