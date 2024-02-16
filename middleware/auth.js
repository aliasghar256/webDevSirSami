const jwt = require('jsonwebtoken')
const secretKey = 'mySecret'

const authenticateToken = (req, res, next) => {
    let token = req.headers.authorization
    token = token.split(' ')[1]
    try {
        const tokenVerification = jwt.verify(token, secretKey)
        if (tokenVerification) {
            req.userId = tokenVerification.id
            next()
            //return res.status(500).json({ Message: "Verified" })
        }
        else { return res.status(401).json({ Message: "Error! Token not Valid" }) }
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

module.exports = authenticateToken