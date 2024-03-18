const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')

const secretKey = 'mySecret'

const signup = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = { email, password }

        //existing user?
        const existingUser = await User.findOne({ email: user.email })
        if (existingUser) return res.status(400).send('Email already exists')

        //Creating a new User
        //Password & Email Verification
        const passwordError = validPassword(user.password)
        if (passwordError !== null) return res.status(400).json({ message: passwordError })
        const emailError = validEmail(user.email)
        if (emailError !== null) return res.status(400).json({ message: passwordError })

        //Password Hashing
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({ email: user.email, password: hashedPassword })
        res.status(201).json({ Message: "New User Created", newUser })
    } catch (err) {
        return res.status(500).json({ message: "Error! " + err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = { email, password }

        //Email verification
        const userInstance = await User.findOne({ email: user.email })

        if (!userInstance) return res.status(400).json({ message: "Email not found" })

        //Password Verification

        const authenticatePassword = await bcrypt.compare(user.password, userInstance.password)
        if (!authenticatePassword) return res.status(400).json({ message: "Password is incorrect" })

        //Create JWT token
        payload = { email: userInstance.email, id: userInstance._id }
        const token = jwt.sign(payload, secretKey, { expiresIn: '1d' })

        return res.status(200).json({ Message:{ token: token } })

    } catch (error) {
        return res.status(500).json({ message: "Error! " + error.message })
    }
}

const validPassword = (password) => {
    if (password.length < 8) return "Error: Password must be at least 8 characters long"

    return null
}

const validEmail = (email) => {
    if (!email.includes('@') || !email.includes('.com') || email.length < 5) return "Error: Invalid Email"
    return null
}

module.exports = { signup, login }