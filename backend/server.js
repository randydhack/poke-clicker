require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan');
// const csurf = require('csurf');
const helmet = require('helmet')
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express()

app.use(morgan('dev'))
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );

  // Set the _csrf token and create req.csrfToken method
//   app.use(
//     csurf({
//       cookie: {
//         secure: isProduction,
//         sameSite: isProduction && "Lax",
//         httpOnly: true
//       }
//     })
//   );

// routes
app.use(routes);

// DB start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to DB", "running on", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
