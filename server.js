require('dotenv').config();
const express = require('express');
const expressJWT = require('express-jwt');
const RateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const rowdyLogger = require('rowdy-logger');

const app = express();
const rowdyResults = rowdyLogger.begin(app);

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(helmet());

const loginLimiter = new RateLimit({
  windowMs: 5*60*1000,
  max: 3,
  delayMs: 0,
  message: "Maximum login attempts exceeded!"
});

const signupLimiter = new RateLimit({
  windowMs: 60*60*1000,
  max: 3,
  delayMs: 0,
  message: "Maximum accounts created. Please try again later."
});

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => {
  console.log(`🍭🍭🍭🍭 Connected to Mongo on ${db.host}:${db.port} 🍭🍭🍭🍭`);
});
db.on('error', (err) => {
  console.log(`🔥🔥🔥🔥 Database error: \n${err}`)
});

//app.use('/auth/login', loginLimiter);
//app.use('/auth/signup', signupLimiter);

app.use('/auth', require('./routes/auth'));
app.use('/api', expressJWT({secret: process.env.JWT_SECRET}), require('./routes/api'));
app.use('/', require('./routes/landing'));

app.listen(process.env.PORT, () => {
  console.log(`🦋🦋🦋🦋... Listening on ${process.env.PORT} ...🦋🦋🦋🦋`);
});
