const jwt = require('jsonwebtoken')
const Users = require('../model/Users')

const verifytoken = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        if (!token) {
            return res.status(401).send({ status: 401, message: "Please provide token" })
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if (decode) {
            const userobj = await Users.findOne({ _id: decode._id }).select("-password")
            req.user = userobj
            next()
        } else {
            return res.status(401).send({ status: 401, messsage: "Unauthorized" })
        }
    }
    catch (e) {
        return res.status(401).send({ status: 401, messsage: "Unauthorized" })
    }
}


module.exports = verifytoken
