const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
    try {
        const currentTokenFromHeader = req.header('Authorization').replace('Bearer ', '')
        const decodedDataFromToken = jwt.verify(currentTokenFromHeader, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ _id: decodedDataFromToken._id, 'tokens.token': currentTokenFromHeader })

        if (!user) {
            throw new Error()
        }

        req.token = currentTokenFromHeader
        req.user = user

        next()
    } catch (error) {
        res.send({
            error: 'Please authenticate'
        })
    }
}

module.exports = auth