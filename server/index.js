import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seed.js';
import productRouter from './routes/book.js';
import userRouter from './routes/user.js';
import orderRouter from './routes/order.js';
import uploadRouter from './routes/upload.js';

dotenv.config({ path: 'config.env'});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

mongoose
    .set('strictQuery', true)
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to db');
    })
    .catch((err) => {
        console.log(err.message);
    });
