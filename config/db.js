const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {dbName: process.env.DB_NAME, useNewUrlParser: true, useUnifiedTopology: true, MaxPoolSize: 100})
    .then(() => {
        console.log('MongoDB connected...')
    })
    .catch((err) => {console.log(err.message)});


mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected...');
});

mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected...');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

var Toggle = {
    // Error mode in text file
    ErrorLogMode: true,
    SecurityMode: true,
  };

module.exports = Toggle;
