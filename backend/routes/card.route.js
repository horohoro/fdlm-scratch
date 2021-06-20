const express = require('express');
const next = require('next');
const app = express();
const cardRoute = express.Router();

// Card model
let Card = require('../model/Card');

const TOTAL_NUMER_OF_PERSONS = 8

// REST
// Add Card
cardRoute.route('/card').post((req, res, next) => {
  console.log(req.originalUrl)

  Card.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all card
cardRoute.route('/cards').get((req, res) => {  
  console.log(req.originalUrl)

  Card.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get random Card
cardRoute.route('/card').get((req, res) => {
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
})

// Get single card by ID
cardRoute.route('/card/:id').get((req, res) => {
  console.log(req.originalUrl)

  Card.findById(req.params.id, (error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update card
cardRoute.route('/card/:id').put((req, res, next) => {
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
})

// Delete card
cardRoute.route('/card/:id').delete((req, res, next) => {
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
})

// SOAP
// Pick and assign an unassigned card
cardRoute.route('/AssignUnassignedCard').get((req, res) => {
  console.log(req.originalUrl)

  if (!req.query.player) {
    throw new Error('Player id must be specified')
  }
  let player = req.query.player

  // Possible race condition between sampling and reserving the card
  // May be solved by using transactions https://mongoosejs.com/docs/transactions.html
  Card.aggregate(
    [{ $match: { player: { $exists: false } } },
    { $sample: { size: 1 } },
    { $set: { player: player, selected: true } }]
  ).exec(
    (error, data) => {
      if (error) {
        console.log(error)
        return next(error)
      } else {
        if (!data || !data.length) {
          throw new Error('No free entry was found')
        }
        Card.findByIdAndUpdate(
          data[0]._id,
          { player: player, selected: true },
          { new: true, strict: true },
          (error, data) => {
            if (error) {
              console.log(error)
              return next(error)
            } else {
              if (!data) {
                throw new Error('No free entry was found')
              }
              res.json(data)
              console.log(`${data.person} has been assigned to player ${player}`)
            }
          })
      }
    }
  )
})

// Unassign player(s)
cardRoute.route('/UnassignPlayer').get((req, res) => {
  console.log(req.originalUrl)

  let filter = {}
  if (req.query.player) {
    filter = { player: req.query.player }
  }

  Card.updateMany(
    filter,
    { $unset: { player : '' , selected: ''} },
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
cardRoute.route('/GameResult').get((req, res) => {
  console.log(req.originalUrl)

  Card.find(
    { selected: true },
    (error, data) => {
      if (error) {
        console.log(error)
        return next(error)
      } 
      if (!data || !data.length) {
        throw new Error('No player found')
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
                throw new Error('Not enough free cards')
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
                        throw new Error('Not enough card selected')
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
cardRoute.route('/UnselectUnassignedCards').get((req, res) => {
  console.log(req.originalUrl)

  Card.updateMany(
    { player: { $exists: false }, selected: true },
    { $unset: ['player', 'selected'] },
    (error, data) => {
      if (error) {
        console.log(error)
        return next(error)
      }
      console.log(data)
      if (data.n != data.nModified) {
        throw new Error('Some matched card were not modified properly')
      }
      console.log('All unassigned card have been unselected')
      res.json(data.nModified)
    }
  )
})

module.exports = cardRoute;