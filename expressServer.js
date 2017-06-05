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
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/pets', (req, res) => {
  fs.readFile(dbFile, (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
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
    return res.sendStatus(400);
  } else {
    fs.readFile(dbFile, (err, data) => {

      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
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
          return res.sendStatus(500);
        }
        res.json(newPet);
      });
    });
  } // END: if - else
});


app.get('/pets/:index', (req, res) => {
  fs.readFile(dbFile, (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    let pets = JSON.parse(data);
    let index = Number.parseInt(req.params.index);

    if (index < 0 || index >= pets.length || Number.isNaN(index)) {
      return res.sendStatus(404);
    }

    res.json(pets[index]);
  });
});


app.get('/*', (req, res) => {
  return res.sendStatus(404);
})


app.listen(port, () => {
  console.log('listening on port', port);
})

module.exports = app;
