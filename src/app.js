import express from 'express';
import connectDB from './database/db.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Todo from './models/todo.model.js';

const app = express();
const port = process.env.port || 3000;

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/todos', asyncHandler(async (req, res) => {
  const todos = await Todo.find();
  res.status(200).send({
    success: true,
    message: "Todo Lists Retrieved Successfully",
    data: todos
  })
}));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof mongoose.Error) {
    return res.status(500).send({
      success: false,
      message: 'Database error occurred.',
      error: err.message
    });
  }
  res.status(500).send({
    success: false,
    message: 'Internal Server Error. Please try again later.',
    error: err.message
  })
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});