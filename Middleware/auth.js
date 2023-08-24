const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const UserModel = require("../Models/userModel");

const AuthenticationFunc = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must have logged in 1" })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must have logged in 2" })
        }
        const { _id } = payload
        UserModel.findById(_id).then(userData => {
            req.user = userData
            next()
        })
    })

}

module.exports = AuthenticationFunc;
