const mongoose = require('mongoose');

const initDb = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/arcticfocus';
  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
};

module.exports = {
  initDb,
  User: require('./models/User'),
  Session: require('./models/Session'),
  Goal: require('./models/Goal'),
  UserSettings: require('./models/UserSettings'),
};
