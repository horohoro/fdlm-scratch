module.exports = {
  db: 'mongodb://horohoro:Zqmvl9GD2tbRmROO@cluster0-shard-00-00.nayhw.mongodb.net:27017,cluster0-shard-00-01.nayhw.mongodb.net:27017,cluster0-shard-00-02.nayhw.mongodb.net:27017',
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
