/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');


const ImageModel = require('./routes/imageRoutes')

const carRouter = require('./routes/carRoutes');
const userRouter = require('./routes/userRoutes');
const interestRouter = require('./routes/interestRoutes');
const offerRouter = require('./routes/offerRoutes');
const auctionRouter = require('./routes/auctionRoutes');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const multer = require('multer');

const crypto = require('crypto');

const imageRouter = require('./routes/imageRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// RUN ONCE
const carModel = require('./models/carModel')

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // GET /api/v1/cars 200 6.921 ms - 8569
}
// middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

mongoose.Promise = require('bluebird');

const storage = new GridFsStorage({
  url: process.env.ATLAS_URI,
  file: (req, file) => {
      return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
              if (err) {
                  return reject(err);
              }
              const filename = buf.toString('hex') + path.extname(file.originalname);
              const fileInfo = {
                  filename: filename,
                  bucketName: 'images'
              };
              resolve(fileInfo);
          });
      });
  }
});

const upload = multer({ storage });


app.use('/api/v1/cars', carRouter); //middleware
app.use('/api/v1/users', userRouter)
app.use('/api/v1/interests', interestRouter)
app.use('/api/v1/offers', offerRouter)
app.use('/api/v1/auctions', auctionRouter)
app.use('/api/v1/images',imageRouter(upload));



app.all('*', (req, res, next) => {
  next(new AppError('Can not find this url on this server', 404));
});

app.use(globalErrorHandler);

module.exports = app;
