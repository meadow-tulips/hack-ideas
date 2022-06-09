import tranformMiddleware from "./transform-middleware.js";

const authMiddleware = (req, res, next) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
      if (!err && session?.user) {
        next();
      } else {
        res.locals.data = { code: 403, response: null, status: "AUTH_FAILURE" };
        tranformMiddleware(req, res, () => {})
      }
    })
}

export default authMiddleware