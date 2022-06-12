const sortOptions = {
    CREATED_ON_ASC: {
        field: "createdOn",
        direction: "asc"
    },
    CREATED_ON_DESC: {
        field: "createdOn",
        direction: "desc"
    },

    VOTES_ASC: {
        field: "votes",
        direction: "asc"
    },
    VOTES_DESC: {
        field: "votes",
        direction: "desc"
    }
}


const paginateMiddleware = (req, res, next) => {
    const { page , sort, limit } = req.query || {};
        res.locals.filters = {
            paginate: {
                page: Number(page || 1),
                limit: Number(limit || 5),
            },            
            sort: sortOptions[sort] || {
                field: "__name__",
                direction: "asc"
            }
        }

    next();
}

export default paginateMiddleware