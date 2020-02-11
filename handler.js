'use strict';

const uuidv4 = require('uuid/v4');
const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.get('/tasks', function (req, res) {
  res.json([
    { id: uuidv4(), description: "Walk the dog", completed: false },
    { id: uuidv4(), description: "Water plants", completed: false },
    { id: uuidv4(), description: "Buy milk", completed: false }
  ]);
});

module.exports.tasks = serverless(app);


