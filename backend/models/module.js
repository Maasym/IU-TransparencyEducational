const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const moduleSchema = mongoose.Schema({
    text: { type: String, required: true },
    value: { type: String, required: true },
})

moduleSchema.plugin(uniqueValidator)

moduleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.id
    }
})

const Module = mongoose.model('Module', moduleSchema)

module.exports = Module