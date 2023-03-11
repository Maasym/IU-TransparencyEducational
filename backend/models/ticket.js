const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const ticketSchema = mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    status: { type: String, required: false },
    module: { type: String, required: true },
    category: { type: String, required: true },
    page: { type: Number, required: false },
    date: { type: Date, required: true },
    attachments: { type: Array , "default" : [], required: false },
    comments: { type: Array , "default" : [], required: false },
    editor: { type: String, required: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

ticketSchema.plugin(uniqueValidator)

ticketSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

ticketSchema.plugin(AutoIncrement, {inc_field: 'ticketNumber'});

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket