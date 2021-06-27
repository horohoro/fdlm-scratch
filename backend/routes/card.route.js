const express = require('express');
const app = express();
const cardRoute = express.Router();
const wiki = require('wikijs').default;

// Card model
let Card = require('../model/Card');

const TOTAL_NUMER_OF_PERSONS = 8
const WIKI_API = {
  en: 'https://en.wikipedia.org/w/api.php',
  fr: 'https://fr.wikipedia.org/w/api.php',
  ja: 'https://ja.wikipedia.org/w/api.php'
}
const ALL_LANGUAGUES = ['en', 'fr', 'ja']

const FREE_CARD_TRANSACTION = { $unset: { player : '' , selected: ''} }

// REST
// Add Card
cardRoute.route('/card').post((req, res, next) => {
  console.log(req.originalUrl)

  let card = req.body

  checkIfExists(card).then(
    (duplicateCard) => {
      if (duplicateCard && duplicateCard.length && duplicateCard.length > 0) {
        handleErrorAndReturnNext(400, `${duplicateCard.length} card for ${card.person.en} already exists.`, res)
        return
      }
      Card.create(
        card,
        (error, data) => {
          if (error) {
            return next(error)
          } else {
            console.log(`${data.person} has been added properly`)
            res.json(data)
          }
        }
      )
    },
    (err) => handleErrorAndReturnNext(500, err.message, res)
  )
});

// Get all card
/*cardRoute.route('/cards').get((req, res, next) => {  
  console.log(req.originalUrl)

  Card.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})*/

// Get random Card
/*cardRoute.route('/card').get((req, res, next) => {
  console.log(req.originalUrl)

  Card.aggregate([{$sample: {size : 1}}]).exec((error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      if (data || !data.length) {
        res.json(data[0])
      }
      res.json(undefined);
    }
  })
})*/

// Get single card by ID
/*cardRoute.route('/card/:id').get((req, res, next) => {
  console.log(req.originalUrl)

  Card.findById(req.params.id, (error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.json(data)
    }
  })
})*/


// Update card
/*cardRoute.route('/card/:id').put((req, res, next) => {
  console.log(req.originalUrl)

  Card.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error)
      return next(error);
    } else {
      res.json(data)
      console.log('Card successfully updated!')
    }
  })
})*/

// Delete card
/*cardRoute.route('/card/:id').delete((req, res, next) => {
  console.log(req.originalUrl)

  Card.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      console.log(error)
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})*/

// SOAP
// Return already assigned card or pick and assign an unassigned card
cardRoute.route('/ReturnCardOrAssignUnassignedCard').get(async (req, res, next) => {
  console.log(req.originalUrl)

  try {
    if (!req.query.player) {
      return handleErrorAndReturnNext(500, 'Player id must be specified', res)
    }
    let player = req.query.player

    let pickedCard = await Card.findOne({player: player}).exec()

    if (pickedCard) {
      await Card.updateMany(
        { player: player, _id: { $ne: pickedCard._id }},
        FREE_CARD_TRANSACTION).exec()

      res.json(pickedCard)
      return
    }

    // Possible race condition between sampling and reserving the card
    // May be solved by using transactions https://mongoosejs.com/docs/transactions.html
    let pickedResult = await Card.aggregate(
      [{ $match: { player: { $exists: false } } },
      { $sample: { size: 1 } }]
    ).exec()

    if (!pickedResult || !pickedResult.length) {
      return handleErrorAndReturnNext(500, 'No free entry was found', res)
    }

    pickedCard = pickedResult[0]

    let updatedCard = await Card.findByIdAndUpdate(
      pickedCard._id,
      { player: player, selected: true },
      { new: true, strict: true }).exec()

    if (!updatedCard) {
      handleErrorAndReturnNext(500, 'The found free entry can no longer be found', res)
      return
    }
    res.json(updatedCard)
    console.log(`${updatedCard.person.en} has been assigned to player ${player}`)

  } catch (err) {
    handleErrorAndReturnNext(500, err.message, res)
  }
})

// Unassign player(s)
cardRoute.route('/UnassignPlayer').get((req, res, next) => {
  console.log(req.originalUrl)

  let filter = {}
  if (req.query.player) {
    filter = { player: req.query.player }
  }

  Card.updateMany(
    filter,
    FREE_CARD_TRANSACTION,
    (error, data) => {
      if (error) {
        console.log(error)
        return next(error)
      } else {
        res.json(data.nModified)
      }
    }
  )
})

// Return result
cardRoute.route('/GameResult').get((req, res, next) => {
  console.log(req.originalUrl)

  Card.find(
    { selected: true },
    (error, data) => {
      if (error) {
        console.log(error)
        return next(error)
      } 
      if (!data || !data.length) {
        return handleErrorAndReturnNext(500, 'No player found', res)
      }
      if (data.length < TOTAL_NUMER_OF_PERSONS) {
          let already_selected = data
          Card.aggregate(
            [
              { $match: { selected: { $ne: true } } },
              { $sample: { size: TOTAL_NUMER_OF_PERSONS - already_selected.length }}
            ],
            (error, data) => {
              if (error) {
                return next(error)
              }
              if (
                !data ||
                !data.length ||
                data.length < TOTAL_NUMER_OF_PERSONS - already_selected.length) {
                return handleErrorAndReturnNext(500, 'Not enough free cards', res)
              }
              Card.updateMany(
                { _id: { $in: data.map(datum => datum._id) } },
                { $set: {selected: true} },
                (error, data) => {
                  if (error) {
                    return next(error)
                  }
                  Card.find(
                    { selected: true },
                    (error, data) => {
                      if (error) {
                        console.log(error)
                        return next(error)
                      } 
                      if (!data || !data.length || data.length < TOTAL_NUMER_OF_PERSONS) {
                        return handleErrorAndReturnNext(500, 'Not enough card selected', res)
                      }
                      res.json(data)
                    })
                })
            }
          )
      } else {
        res.json(data)
      }
    }
  )
})

// Unselect (reset) card that are not assigned to users already
cardRoute.route('/UnselectUnassignedCards').get((req, res, next) => {
  console.log(req.originalUrl)

  Card.updateMany(
    { player: { $exists: false }, selected: true },
    FREE_CARD_TRANSACTION,
    (error, data) => {
      if (error) {
        console.log(error)
        return next(error)
      }
      if (data.n != data.nModified) {
        return handleErrorAndReturnNext(500, 'Some matched card were not modified properly', res)
      }
      console.log(`All (${data.nModified}) unassigned card have been unselected`)
      res.json(data.nModified)
    }
  )
})

// Preload a card based on limited information
cardRoute.route('/PreloadCard').post((req, res, next) => {
  console.log(req.originalUrl)

  let card = req.body
  let search
  let fromPerson

  if (card.inputLang) {
    search = card.inputLang;
    fromPerson = !(card.wikipedia && card.wikipedia[search]) ;
  } else { // !card.inputLang => let's check what has been input
    if (card.wikipedia) {
      if (card.wikipedia.en) {
        search = 'en'
        card.inputLang = 'en'
        fromPerson = false
      } else if (card.wikipedia.fr) {
        search = 'fr'
        card.inputLang = 'fr'
        fromPerson = false
      } else if (card.wikipedia.ja) {
        search = 'ja'
        card.inputLang = 'ja'
        fromPerson = false
      }
    } 
    if (!search && card.person) { // !card.wikipedia => let's check the persons
      fromPerson = true
      if (card.person.en) {
        search = 'en'
        card.inputLang = 'en'
      } else if (card.person.fr) {
        search = 'fr'
        card.inputLang = 'fr'
      } else if (card.person.ja) {
        search = 'ja'
        card.inputLang = 'ja'
      }     
    }
  }

  if (!search || fromPerson === undefined || !card.inputLang) {
    handleErrorAndReturnNext(400, 'missing fields', res)
    return
  }

  const sets = ALL_LANGUAGUES.filter(x => x != search);

  let promise = new Promise((resolve, reject) => resolve(0))

  // If wikipedia was not input, let's search for it
  if (fromPerson) {
    promise = wiki({ apiUrl: WIKI_API[search]}).find(card.person[search]).then(
      page => {
        card.person[search] = page.title

        if (!card.wikipedia) {
          card.wikipedia = {}
        }
        card.wikipedia[search] = page.canonicalurl
      },
      err => { throw Error('Person not found') }
    )
  }

  // Find the name and the other languages
  return promise
    .then(
      () => wiki({ apiUrl: WIKI_API[search]})
        .page(getTitleFromWikiURL(card.wikipedia[search])),
      (err) => { throw err })
    .then(
      page => {
        if (!page) {
          throw Error('Wiki page not found')
        }
        
        if (!card.person) {
          card.person = {}
        }
        card.person[search] = page.title

        return Promise.all
          ([
            page.langlinks().then(
              langlinks => {
                sets.forEach((set) => {
                  let setEntry = langlinks
                    .filter(langlink => langlink.lang.startsWith(set))
                    .sort(langlink => langlink.lang)[0]
        
                  if (!setEntry) {
                    console.log(`No entry found for ${card.person[search]} in ${set}`)
                    return // next language
                  }
        
                  card.person[set] = setEntry.title
                  
                  if (!card.wikipedia) {
                    card.wikipedia = {}
                  }
                  card.wikipedia[set] = setEntry.url
                })
              },
              err => { throw err }
            ),

            // Search image in the primary language
            // If there is no image, it may take a very very shitty image (like an icon)
            // TODO(horo): filter these images out and fallback to other languages
            // TODO(horo): may need to switch to English https://github.com/dijs/wiki/issues/156
            page.mainImage().then(
              mainImage => {
                card.imageUrl = mainImage
              },
              err => { throw err }
            ).catch(err => console.log(`mainImage failed with ${err.message}`)) // https://github.com/dijs/wiki/issues/157
          ])
      },
      err => { throw err })
    .then(
      values => res.json(card),
      err => handleErrorAndReturnNext(500, err.message, res))
})

// Handle error
function handleErrorAndReturnNext(code, message, res,) {
  console.log(message)
  res.status(code).send(message)
}

// Internal function
function getTitleFromWikiURL(url) {
  return decodeURI(url.split('/').reverse()[0].split('?')[0])
}

// Internal function
function checkIfExists(card) {
  let itemsToCheck = []

  if (card.person) {
      this.person = {}
      if (card.person.en) itemsToCheck.push({"person.en": card.person.en})
      if (card.person.fr) itemsToCheck.push({"person.fr": card.person.fr})
      if (card.person.ja) itemsToCheck.push({"person.ja": card.person.ja})
  }
  if (card.wikipedia) {
      this.wikipedia = {}
      if (card.wikipedia.en) itemsToCheck.push({"wikipedia.en": card.wikipedia.en})
      if (card.wikipedia.fr) itemsToCheck.push({"wikipedia.fr": card.wikipedia.fr})
      if (card.wikipedia.ja) itemsToCheck.push({"wikipedia.ja": card.wikipedia.ja})
  }

  return Card.find({ $or: itemsToCheck }).exec()
}

module.exports = cardRoute;