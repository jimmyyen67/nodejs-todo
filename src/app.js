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
  try {
    const todos = await Todo.find();
    res.status(200).send({
      success: true,
      message: "All Todo-lists Retrieved SUCCESSFULLY",
      data: todos
    })
  } catch (err) {
    err.errorType = "TodoRetrieveError";
    err.customMessage = "Retrieve All Todo-list FAILED";
    throw err;
  }

}));

app.post('/todos', asyncHandler(async (req, res) => {
  try {
    const todo = req.body;
    const result = await Todo.create(todo);
    res.status(201).send({
      success: true,
      message: "The Todo-list Created SUCCESSFULLY",
      data: result
    })
  } catch (err) {
    err.errorType = "TodoCreateError";
    err.customMessage = "Insert todo-list FAILED";
    throw err;
  }
}));

app.get('/todos/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const todo = await Todo.findById(id);
    res.status(200).send({
      success: true,
      message: "The todo-list retrieved SUCCESSFULLY",
      data: todo
    })
  } catch (err) {
    err.errorType = "TodoRetrieveError";
    err.customMessage = "Retrieve todo-list FAILED";
    throw err;
  }
}));

app.put('/todos/:id', asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const todo = req.body;
    const result = await Todo.findByIdAndUpdate(id, todo);
    if (!result) {
      throw new Error('Todo not found');
    }
    res.status(200).send({
      success: true,
      message: "The todo-list updated SUCCESSFULLY",
      data: result
    });
  } catch (err) {
    err.errorType = "TodoUpdateError";
    err.customMessage = "Update todo-list FAILED";
    throw err;
  }
}));

app.delete('/todos/:id', asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Todo.findByIdAndDelete(id);
    
    if (!result) {
      throw new Error('Todo not found');
    }
    
    res.status(200).send({
      success: true,
      message: "The todo-list deleted SUCCESSFULLY",
      data: result
    });
  } catch (err) {
    err.errorType = "TodoDeleteError";
    err.customMessage = "Delete todo-list FAILED";
    throw err;
  }
}));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.errorType) {
    return res.status(err.status || 500).send({
      success: false,
      message: err.customMessage,
      error: err.message
    })
  }

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