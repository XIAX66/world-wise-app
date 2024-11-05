const City = require('../models/cityModels');
const catchAsync = require('../utils/catchAsync');

exports.getAllCities = catchAsync(async (req, res, next) => {
  console.log(req.query);
  let cityQuery = City.find();
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    console.log(fields);
    cityQuery = cityQuery.select(fields);
  } else {
    cityQuery = cityQuery.select('-__v');
  }
  const cities = await cityQuery;

  res.status(200).json({
    status: 'success',
    result: cities.length,
    data: {
      cities,
    },
  });
});

exports.getCity = catchAsync(async (req, res, next) => {
  const city = await City.findById(req.params.id);

  if (!city) {
    return next(new Error('No city with that Id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      city,
    },
  });
});

exports.createCity = catchAsync(async (req, res, next) => {
  const newCity = await City.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      city: newCity,
    },
  });
});

exports.updateCity = catchAsync(async (req, res, next) => {
  const city = await City.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!city) {
    return next(new Error('No city with that Id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      city,
    },
  });
});

exports.deleteCity = catchAsync(async (req, res, next) => {
  const city = await City.findOneAndDelete(req.params.id);

  if (!city) {
    return next(new Error('No city with that Id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.aliasGetCountries = (req, res, next) => {
  req.query.fields = 'country,emoji';
  next();
};
