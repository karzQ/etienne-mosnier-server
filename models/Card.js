const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cardSchema = new Schema({
    type: mongoose.Schema.Types.String,
    title: mongoose.Schema.Types.String,
    subtitle: mongoose.Schema.Types.String,
    text: mongoose.Schema.Types.String,
    image: mongoose.Schema.Types.String
}, {
    collection: 'cards'
})

module.exports = mongoose.model('Card', cardSchema)