const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = process.env.dbUrl;

mongoose
  .connect(dbUrl)
  .then(() => console.log('database is connected'))
  .catch((error) => console.log(error.message));
