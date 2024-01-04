const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const UserModel = require('../models/userModel')

const registerUser = asyncHandler(async (req, res) => {
    // // Retrieving body infos.
    const { username, email, password } = req.body

    // Check if all fields are filled
    if (!username || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user already exists
    const userExists = await UserModel.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create the user
    const user = await UserModel.create({
        username,
        email,
        password: hashedPassword
    })

    // Handling the response
    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

const loginUser = asyncHandler(async (req, res) => {
    // Retrieving body infos.
    const { email, password } = req.body

    // Check if the email exists in the db / Check password OK
    const user = await UserModel.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
        // Handling the response
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        })
    }
    else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'User data' })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}