const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const City = require('../models/cityModels');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
)
  .replace('<USER>', process.env.USER)
  .replace('<DATABASE_NAME>', process.env.DATABASE_NAME);

mongoose.connect(DB).then((con) => {
  console.log('DB connection successful!');
});

const cities = JSON.parse(
  fs.readFileSync(`${__dirname}/cities.json`, 'utf-8'),
).cities;

const importData = async () => {
  try {
    await City.create(cities);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await City.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
