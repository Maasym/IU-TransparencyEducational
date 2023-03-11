const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const categorySchema = mongoose.Schema({
    text: { type: String, required: true },
    value: { type: String, required: true },
})

categorySchema.plugin(uniqueValidator)

categorySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.id
    }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category