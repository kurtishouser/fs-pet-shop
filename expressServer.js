'use strict';

const fs = require('fs');
const path = require('path');
const dbFile = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const bodyParser = require('body-parser');

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


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


app.post('/pets', (req, res) => {
  let age = Number.parseInt(req.body.age);
  let kind = req.body.kind;
  let name = req.body.name;

  if (Number.isNaN(age) || !kind || !name) {
    res.set('Content-Type', 'text/plain');
    res.status(400).send('Bad Request');
  } else {
    fs.readFile(dbFile, (err, data) => {

      if (err) {
        console.error(err.stack);
        res.sendStatus(500);
      }

      let pets = JSON.parse(data);
      let newPet = {
        age: age,
        kind: kind,
        name: name
      }
      pets.push(newPet);

      fs.writeFile(dbFile, JSON.stringify(pets), (err) => {
        if (err) {
          console.error(err.stack);
          res.sendStatus(500);
        }
        // res.set('Content-Type', 'application/json');
        res.json(newPet);
      });
    });
  } // END: if - else
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


app.get('/*', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.status(404).send('Not Found');
})

app.listen(8000, () => {
  console.log('listening on port', port);
})

module.exports = app;
