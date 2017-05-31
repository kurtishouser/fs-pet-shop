'use strict';

const fs = require('fs');
const path = require('path');
const dbFile = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();

app.get('/pets', (req, res) => {
  fs.readFile(dbFile, (err, data) => {
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);
    }

    let pets = JSON.parse(data);

    res.json(pets);
  });
});

app.get('/pets/:index', (req, res) => {
  fs.readFile(dbFile, (err, data) => {
    if (err) {
      console.error(err.stack);
      res.sendStatus(500);
    }

    let pets = JSON.parse(data);
    let index = Number.parseInt(req.params.index);

    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      res.set('Content-Type', 'text/plain')
      res.status(404).send('Not Found');
    }

    res.json(pets[index]);
  });
});

app.listen(8000, () => {
  console.log('listening on port 8000');
})

module.exports = app;
