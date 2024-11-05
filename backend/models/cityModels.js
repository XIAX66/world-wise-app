const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      require: [true, 'A city must a name'],
    },
    country: {
      type: String,
      require: [true, 'A city must a name'],
    },
    emoji: {
      type: String,
    },
    date: {
      require: true,
      type: String,
      validate: {
        validator: function (val) {
          return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(val);
        },
        message: (props) => `${props.value} is not right-formatted`,
      },
    },
    notes: {
      type: String,
      require: false,
    },
    position: {
      lat: {
        type: Number,
        required: true,
        validate: {
          validator: function (v) {
            // 检查纬度范围
            return v >= -90 && v <= 90;
          },
          message: (props) => `${props.value} is out of latitude range!`,
        },
      },
      lng: {
        type: Number,
        required: true,
        validate: {
          validator: function (v) {
            // 检查经度范围
            return v >= -180 && v <= 180;
          },
          message: (props) => `${props.value} is out of latitude range!`,
        },
      },
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

citySchema.virtual('continent').get(function () {
  const { lat, lng } = this.position;

  if (lat >= -60 && lat <= 10 && lng >= -80 && lng <= -50) {
    return 'South America'; // 南美洲
  } else if (lat >= 10 && lat <= 60 && lng >= -30 && lng <= 50) {
    return 'Europe'; // 欧洲
  } else if (lat >= 30 && lat <= 60 && lng >= -30 && lng <= 50) {
    return 'Asia'; // 亚洲
  } else if (lat >= -60 && lat <= 0 && lng >= 150 && lng <= 180) {
    return 'Oceania'; // 大洋洲
  } else {
    return 'Unknown'; // 未知
  }
});

const City = mongoose.model('City', citySchema);

module.exports = City;
