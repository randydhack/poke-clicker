// backend/routes/api/index.js
const router = require('express').Router();
// const sessionRouter = require('./session.js');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null

// router.use('/session', sessionRouter);



router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });


module.exports = router;
