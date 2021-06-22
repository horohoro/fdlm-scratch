let mongoose = require('mongoose'),
  dataBaseConfig = require('../database/db'),
  wiki = require('wikijs').default,
  Card = require('../model/Card');

const WIKI_API = {
  en: 'https://en.wikipedia.org/w/api.php',
  fr: 'https://fr.wikipedia.org/w/api.php',
  ja: 'https://ja.wikipedia.org/w/api.php'
}

// Fix french input with English (cf https://github.com/dijs/wiki/issues/156)
const toRepair = [ // person.fr
    //'Jean Moulin',
]

mongoose.connect(dataBaseConfig.db, dataBaseConfig.options)
    .then(
        mongoose => {
            return Card.find({$or: [{imageUrl : {$exists: false}}, {"person.fr": {$in: toRepair}}]}).exec()
        },
        err => { throw err }
    ).then(
        cards => {
            console.log(`${cards.length} cards found`)

            cards = cards.map(card => {
                if (toRepair.includes(card.person.fr)) {
                    card.inputLang = 'en'
                }
                return card
            })

            return Promise.all(cards.map(
                card => {
                    return wiki(
                        {
                            apiUrl: WIKI_API[card.inputLang],
                            origin: '*',
                            headers: {
                                'User-Agent': 'FDLM-bot/0.1 (https://github.com/horohoro/fdlm-scratch/)'
                            }
                        }
                    ).find(card.person[card.inputLang]).then(
                        page => {
                            return page.mainImage()
                        },
                        err => { throw err }
                    ).then(
                        mainImage => {
                            card.imageUrl = mainImage
                            return card
                        },
                        err => { throw err }
                    )
                }))
        },
        err => { throw err }
    ).then(
        cards => {
            return Promise.all(cards.map(
                card => {
                    return Card.findByIdAndUpdate(
                        card._id,
                        { $set: {imageUrl: card.imageUrl }},
                        { omitUndefined: true, new: true})
                        .exec()
                        .then(
                            card => console.log(`${card._id} has been updated`),
                            err => { throw err }
                        )
                })
            )
        },
        err => { throw err }
    )

