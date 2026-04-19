
const userModel = require("../models/usermodel")
const jwt = require("jsonwebtoken")

async function authmiddleware(req, res, next) {
    try {
        const token =
            req.cookies.token ||
            req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access, token is missing"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel
            .findById(decoded.userId)
            .select("-password")

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        req.user = user
        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}

module.exports =
    authmiddleware
