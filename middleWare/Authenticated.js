
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {

        res.json({ success: false, message: "access denied" })
    }
}

export default isAuthenticated;