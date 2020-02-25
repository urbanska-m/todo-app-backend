'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
app.use(express.json());
const uuidv4 = require('uuid/v4');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA
});

// Retrieving tasks
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

  // Accept info from client about what task is being created

  const taskToInsert = req.body;
  taskToInsert.taskId = uuidv4();

  // Take that info, pre-populate an SQL INSERT statement
  // Execute statement

  connection.query('INSERT INTO `tasks` SET ?', taskToInsert, function (error, results, fields) {
    if(error) {
      console.error("Your query had a problem with inserting a new task", error);
      res.status(500).json({errorMessage: error});
    }
    else {
      // Return to client info about task that has been created
      res.json({
        task: taskToInsert
      });
    }
  });
});

// Updating tasks
app.put('/tasks/:taskId', function (req, res) {

  // Identify task being updated
  // const taskToEdit = req.params.taskId;
  // const taskDescription = req.body;
  // const completed = req.body;

  // Execute SQL command to UPDATE
  connection.query('UPDATE `tasks` SET `taskDescription` = ?, `completed` = ? WHERE `taskId` = ?', [req.body.taskDescription, req.body.completed, req.params.taskId], function (error, results, fields) {
    if(error) {
      console.error("Your query had a problem with updating the task", error);
      res.status(500).json({errorMessage: error});
    }
    else {
      // Return to client info about task that has been updated
      res.json({
        updatedTask: results,
        message: "Your task was updated"
      });
    }
  })
});

// Deleting tasks
app.delete('/tasks/:taskId', function (req, res) {

  // Identify task being deleted
  const taskToDelete = req.params.taskId;

  // Execute SQL command to DELETE
  connection.query('DELETE FROM `tasks` WHERE `taskId` = ?', taskToDelete, function (error, results, fields) {
    if(error) {
      console.error("Your query had a problem with deleting the task", error);
      res.status(500).json({errorMessage: error});
    }
    else {
      // Return to client info about task that has been deleted
      res.json({
        deletedTask: results,
        message: "Your task was deleted"
      });
    }
  })
});

module.exports.tasks = serverless(app);


