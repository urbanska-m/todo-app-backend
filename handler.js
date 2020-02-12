'use strict';

const serverless = require('serverless-http');
const express = require('express')
const app = express()
const uuidv4 = require('uuid/v4');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host : 'instance',
  user : '',
  password : '',
  database: 'todo_app'
});

app.get('/tasks', function (req, res) {
  
  connection.query('SELECT * FROM `tasks` WHERE `userId` = 2', function (error, results, fields) {
    // error will be an Error if one occurred during the query
    if(error) {
      console.error("Your query had a problem with fetching tasks", error);
      res.status(500).json({errorMessage: error});
    }
    else {
      // Query was successful
      res.json({tasks: results});
    }
  });
});

// Creating tasks
app.post('/tasks', function (req, res) {
  res.json({
    message: 'Your POST works',
  });
});

// Updating tasks
app.put('/tasks/:taskId', function (req, res) {
  res.json({
    message: 'Your PUT works',
  });
});

// Deleting tasks
app.delete('/tasks/:taskId', function (req, res) {
  res.json({
    message: 'Your DELETE works',
  });
});

module.exports.tasks = serverless(app);


