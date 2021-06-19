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
  if (!req.query.player) {
    throw new Error('Player id must be specified')
  }
  let player = req.query.player

  console.log(player)

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
        console.log(data[0]);
        res.json(data[0])
        console.log(`${data[0].person} has been assigned to player ${player}`)
      }
    }
  )
})

// Unassign player(s)
cardRoute.route('/UnassignPlayer').get((req, res) => {
  let aggregates = []
  let player = req.query.player

  if (player) {
    aggregates.push({ $match: { player: player} })
  }

  aggregates.push({ $unset: ['player', 'selected'] })

  Card.aggregate(aggregates).exec(
    (error, data) => {
      if (error) {
        console.log(error)
        return next(error)
      } else {
        res.json(data)
      }
    }
  )
})

// Return result
cardRoute.route('/GameResult').get((req, res) => {
  Card.aggregate([{ $match: { selected: true } }]).exec(
    (error, data) => {
      if (error) {
        console.log(error)
        return next(error)
      } else {
        if (!data || !data.length) {
          throw new Error('No free entry was found')
        }
        if (data.length <= TOTAL_NUMER_OF_PERSONS) {
            let already_selected = data
            Card.aggregate([
              { $match: { selected: false } },
              { $sample: {size: TOTAL_NUMER_OF_PERSONS - data.length}},
              { $set: {selected: true} }]
            ).exec(
              (error, data) => {
                if (error) {
                  console.log(error)
                  return next(error)
                } else {
                  if (!data || !data.length) {
                    throw new Error('No free entry was found')
                  }
                  res.json(already_selected + data)
                }
              }
            )
        } else {
          res.json(data)
        }
      }
    }
  )
})

// Unselect (reset) card that are not assigned to users already
cardRoute.route('/UnselectUnassignedCards').get((req, res) => {
  let aggregates = []
  let player = req.query.player

  if (player) {
    aggregates.push()
  }

  Card.aggregate([
    { $match: { player: { $exists: false }, selected: true }},
    { $unset: ['player', 'selected'] }
  ]).exec(
    (error, data) => {
      if (error) {
        console.log(error)
        return next(error)
      } else {
        if (!data || !data.length) {
          throw new Error('No free entry was found')
        }
        console.log('All unassigned card have been unselected')
        res.json(data)
      }
    }
  )
})

module.exports = cardRoute;