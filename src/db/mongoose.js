const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/trackYourMoneyDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});