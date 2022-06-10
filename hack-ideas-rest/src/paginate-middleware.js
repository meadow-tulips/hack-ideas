const paginateMiddleware = (req, res, next) => {
    const { page , sort, limit } = req.query || {};
        
        res.locals.filters = {
            paginate: {
                page: Number(page || 1),
                limit: Number(limit || 10),
            },            
            sort
        }

    next();
}

export default paginateMiddleware