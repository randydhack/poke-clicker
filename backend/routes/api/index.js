// backend/routes/api/index.js
const router = require('express').Router();
const userRouter = require('./user.js')

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null


router.use('/user', userRouter)


router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });


module.exports = router;
