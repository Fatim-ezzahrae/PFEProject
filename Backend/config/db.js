const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
  // use the db object to interact with your database
});

// export the db object so that it can be used in other parts of the application
module.exports = db;

//export schema
module.exports = { Schema, mongoose };
