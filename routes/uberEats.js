const router = require('express').Router();
const getData = require('../data/getData');

router.get('/refresh', (req, res) => {
  getData();
  res.sendStatus(200);
});

router.get('/locations', (req, res) => {
  res.sendStatus(200);
});

router.get('/restaurants', (req, res) => {
  const { location } = req.query;
  res.send(location);
});

router.get('/restaurants', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;