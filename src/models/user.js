const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Income = require('../models/income')
const Expense = require('../models/expense')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// creating a virtual field 'incomes' for User model, which won't be stored in database but we can see all the incomes of that user
userSchema.virtual('incomes', {
    ref: 'Income',
    localField: '_id',
    foreignField: 'owner'
        // this means here, the localField for the User model i.e. '_id' and foreignField for the User model i.e. 'owner' are connected
        // in otherwords, the 'owner' property of the 'Income' model stores the '_id' of User object 
})

// creating a virtual field 'expenses' for User model, which won't be stored in database but we can see all the expenses of that user
userSchema.virtual('expenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'owner'
        // this means here, the localField for the User model i.e. '_id' and foreignField for the User model i.e. 'owner' are connected
        // in otherwords, the 'owner' property of the 'Expense' model stores the '_id' of User object 
})

// hiding private data of user such as password and auth-tokens
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.profilePic

    return userObject
}

// generating auth token for user after signup and each signin
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// logging in user by email and password
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// hash the password before saving the user
userSchema.pre('save', async function(next) {
    const currentUser = this

    if (currentUser.isModified('password')) {
        currentUser.password = await bcrypt.hash(currentUser.password, 8)
    }

    next()
})

// delete all the incomes and expenses createed by the user before deleting the user
userSchema.pre('remove', async function(next) {
    const currentUser = this

    await Income.deleteMany({ owner: currentUser._id })
    await Expense.deleteMany({ owner: currentUser._id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User