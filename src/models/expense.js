const mongoose = require('mongoose')
const validator = require('validator')
const dateValidator = require('is-my-date-valid')
const validateDate = dateValidator({ format: 'DD-MMMM-YYYY' })

const expenseSchema = mongoose.Schema({
    date: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validateDate(value)) {
                throw new Error('Invalid date')
            }
        }
    },
    expenseName: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value == '') {
                throw new Error('Invalid entry')
            }
        }
    },
    expenseAmount: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Invalid amount')
            }
        }
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense