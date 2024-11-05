const express = require('express');
const {
  getAllCities,
  createCity,
  getCity,
  updateCity,
  deleteCity,
  aliasGetCountries,
} = require('../controllers/cityController');

const router = express.Router();

router.route('/').get(getAllCities).post(createCity);
router.route('/countries').get(aliasGetCountries, getAllCities);
router.route('/:id').get(getCity).patch(updateCity).delete(deleteCity);

module.exports = router;
