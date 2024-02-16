const jwt = require('jsonwebtoken')
const secretKey = 'mySecret'

const authenticateToken = (req, res, next) => {
    const { token } = req.body
    const tokenValue = { token }
    try {
        const tokenVerification = jwt.verify(tokenValue.token, secretKey)
        if (tokenVerification) {
            req.userId = tokenVerification.id
            next()
            //return res.status(500).json({ Message: "Verified" })
        }
        return res.status(401).json({ Message: "Error! Token not Valid" })
    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

module.exports = authenticateToken