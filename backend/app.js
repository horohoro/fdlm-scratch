let express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  dataBaseConfig = require('./database/db');

// Connecting mongoDB
mongoose.Promise = global.Promise;
console.log(`Connecting to ${dataBaseConfig.db}`)
mongoose.connect(dataBaseConfig.db, dataBaseConfig.options)
  .then(
    mongoose => {
      console.log('Database connected sucessfully ')
    },
    error => {
      console.log('Could not connected to database : ' + error)
    })

// Set up express js port
const cardRoute = require('./routes/card.route')

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cors());

// RESTful API root
app.use('/api', cardRoute)

// PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Index Route
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
