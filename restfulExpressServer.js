'use strict';

const fs = require('fs');
const path = require('path');
const dbFile = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const bodyParser = require('body-parser');
const morgan = require('morgan');

app.disable('x-powered-by');
app.use(morgan('short'));
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

    if (Number.isNaN(index) || index < 0 || index >= pets.length) {
      return res.sendStatus(404);
    }
    res.json(pets[index]);
  });
});


app.delete('/pets/:index', (req, res) => {
  let index = Number.parseInt(req.params.index);

  fs.readFile(dbFile, (err, data) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    let pets = JSON.parse(data);

    if (Number.isNaN(index) || index < 0 || index >= pets.length) {
      return res.sendStatus(404);
    }

    let deletePet = pets.splice(index, 1);

    fs.writeFile(dbFile, JSON.stringify(pets), (err) => {
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      res.json(deletePet[0]);
    })
  })
});


app.get('/*', (req, res) => {
  res.status(404);
})


app.listen(port, () => {
  console.log('listening on port', port);
})


module.exports = app;
