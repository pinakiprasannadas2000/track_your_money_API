const mongoose = require('mongoose')
const validator = require('validator')
const dateValidator = require('is-my-date-valid')
const validateDate = dateValidator({ format: 'DD-MMMM-YYYY' })

const incomeSchema = mongoose.Schema({
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
    incomeName: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value === '') {
                throw new Error('Invalid entry')
            }
        }
    },
    incomeAmount: {
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

const Income = mongoose.model('Income', incomeSchema)

module.exports = Income