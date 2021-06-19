const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//mongoose

// Define collection and schema
let Card = new Schema({
  person: {
    type: String,
    required: true
  },
  player: {
    type: Number
  },
  selected: {
    type: Boolean
  }
}, {
  collection: 'Cards'
})

module.exports = mongoose.model('Cards', Card)