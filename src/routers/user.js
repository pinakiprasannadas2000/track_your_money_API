const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()

// create a new user
router.post('/users/signup', async(req, res) => {
    const currentUser = new User(req.body)

    try {
        await currentUser.save()
        const token = await currentUser.generateAuthToken()
        res.status(201).send({
            result: 'User account created',
            dataCreated: currentUser,
            token
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// user login
router.post('/users/signin', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({
            result: 'Signed in successfully',
            userSignedIn: user,
            token
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// user logout
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()
        res.send({
            result: 'Logged out successfully'
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// user logout from all logged in sessions
router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({
            result: 'Logged out from all sessions successfully'
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// get profile
router.get('/users/me', auth, async(req, res) => {
    res.send({
        result: 'Found',
        dataFound: req.user
    })
})

// update profile
router.patch('/users/me', auth, async(req, res) => {
    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'password']
    const isAllowedOperation = requestedUpdates.every((requestedUpdate) => {
        return allowedUpdates.includes(requestedUpdate)
    })

    if (!isAllowedOperation) {
        return res.send({
            error: 'Invalid requested updates'
        })
    }

    try {
        requestedUpdates.forEach((requestedUpdate) => {
            req.user[requestedUpdate] = req.body[requestedUpdate]
        })
        await req.user.save()
        res.send({
            result: 'Updated',
            dataUpdated: req.user
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// delete profile
router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send({
            result: 'Deleted',
            dataDeleted: req.user
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

module.exports = router