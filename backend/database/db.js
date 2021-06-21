var credentials = require('./credentials.json')

module.exports = {
  db: `mongodb://${credentials.username}:${credentials.password}@${credentials.server}`,
  options:  {
    dbName: "FDLM",
    replicaSet: "Main-shard-0",
    authSource: "admin",
    retryWrites: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    ssl: true
  }
};
