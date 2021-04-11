const express = require('express')
const Income = require('../models/income')
const auth = require('../middleware/auth')

const router = express.Router()

// create new income
router.post('/incomes', auth, async(req, res) => {
    const currentIncome = new Income({
        ...req.body,
        owner: req.user._id
    })

    try {
        await currentIncome.save()
        res.send({
            result: 'New income created',
            DataCreated: currentIncome
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// get all incomes
// GET /incomes?date=12-April-2021
router.get('/incomes', auth, async(req, res) => {
    const match = {}

    if (req.query.date) {
        match.date = req.query.date
    }

    try {
        await req.user.populate({
            path: 'incomes',
            match,
            options: {
                limit: 10
            }
        }).execPopulate()

        res.send({
            result: 'Found',
            DataFound: req.user.incomes
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// get a particular income
router.get('/incomes/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const income = await Income.findOne({ _id, owner: req.user._id })
        if (!income) {
            return res.send({
                result: 'No such income is created'
            })
        }
        res.send({
            result: 'Found',
            DataFound: income
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// update a particular income
router.patch('/incomes/:id', auth, async(req, res) => {
    const _id = req.params.id

    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['date', 'incomeName', 'incomeAmount', 'description']
    const isAllowedOperation = requestedUpdates.every((requestedUpdate) => {
        return allowedUpdates.includes(requestedUpdate)
    })

    if (!isAllowedOperation) {
        return res.send({
            error: 'Invalid requested updates'
        })
    }

    try {
        const income = await Income.findOne({ _id, owner: req.user._id })

        if (!income) {
            return res.send({
                result: 'No such income is created'
            })
        }

        requestedUpdates.forEach((requestedUpdate) => {
            income[requestedUpdate] = req.body[requestedUpdate]
        })

        await income.save()

        res.send({
            result: 'Updated',
            dataUpdated: income
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// delete all incomes
router.delete('/incomes', auth, async(req, res) => {
    try {
        await Income.deleteMany({ owner: req.user._id })
        res.send({
            result: 'Deleted all'
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// delete a particular income
router.delete('/incomes/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const deletedIncome = await Income.findByIdAndDelete({ _id, owner: req.user._id })
        res.send({
            result: 'Deleted',
            dataDeleted: deletedIncome
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

module.exports = router