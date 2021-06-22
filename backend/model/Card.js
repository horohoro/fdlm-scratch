const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//mongoose

// Define collection and schema
let Card = new Schema({
  person: new Schema({
    en: String,
    ja: String,
    fr: String
  }),
  wikipedia: new Schema({
    en: String,
    ja: String,
    fr: String
  }),
  player: Number,
  selected: Boolean,
  inputLang: String,
  difficulty: String,
  imageUrl: String
}, {
  collection: 'Cards'
})

module.exports = mongoose.model('Cards', Card)