const express = require('express')
const Expense = require('../models/expense')
const auth = require('../middleware/auth')

const router = express.Router()

// create new expense
router.post('/expenses', auth, async(req, res) => {
    const currentExpense = new Expense({
        ...req.body,
        owner: req.user._id
    })

    try {
        await currentExpense.save()
        res.send({
            result: 'New expense created',
            DataCreated: currentExpense
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// get all expenses
// GET /expenses?date=12-April-2021
router.get('/expenses', auth, async(req, res) => {
    const match = {}

    if (req.query.date) {
        match.date = req.query.date
    }

    try {
        await req.user.populate({
            path: 'expenses',
            match,
            options: {
                limit: 10
            }
        }).execPopulate()

        res.send({
            result: 'Found',
            dataFound: req.user.expenses
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// get a particular expense
router.get('/expenses/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const expense = await Expense.findOne({ _id, owner: req.user._id })
        if (!expense) {
            return res.send({
                result: 'No such expense is created'
            })
        }
        res.send({
            result: 'Found',
            DataFound: expense
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// update a particular expense
router.patch('/expenses/:id', auth, async(req, res) => {
    const _id = req.params.id

    const requestedUpdates = Object.keys(req.body)
    const allowedUpdates = ['date', 'expenseName', 'expenseAmount', 'description']
    const isAllowedOperation = requestedUpdates.every((requestedUpdate) => {
        return allowedUpdates.includes(requestedUpdate)
    })

    if (!isAllowedOperation) {
        return res.send({
            error: 'Invalid requested updates'
        })
    }

    try {
        const expense = await Expense.findOne({ _id, owner: req.user._id })

        if (!expense) {
            return res.send({
                result: 'No such expense is created'
            })
        }

        requestedUpdates.forEach((requestedUpdate) => {
            expense[requestedUpdate] = req.body[requestedUpdate]
        })

        await expense.save()

        res.send({
            result: 'Updated',
            dataUpdated: expense
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// delete all expenses
router.delete('/expenses', auth, async(req, res) => {
    try {
        await Expense.deleteMany({ owner: req.user._id })
        res.send({
            result: 'Deleted all'
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

// delete a particular expense
router.delete('/expenses/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const deletedExpense = await Expense.findByIdAndDelete({ _id, owner: req.user._id })
        res.send({
            result: 'Deleted',
            dataDeleted: deletedExpense
        })
    } catch (error) {
        res.send({
            error
        })
    }
})

module.exports = router