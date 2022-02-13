import mongoose from 'mongoose';
import { MONGO_HOST } from './config';

const config: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.Promise = require('bluebird');

mongoose.connect(MONGO_HOST, config, err => {
  if (!err) console.log('MongoDB connection successfully');
  else console.log(`MongoDB connection failed : ${err}`);
});

export default mongoose;
