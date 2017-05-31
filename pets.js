#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, 'pets.json');


const validCommands = ['read', 'create', 'update', 'destroy'];

let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);
let cmd = process.argv[2];

function readDatabase(db, callback) {
  fs.readFile(db, (err, data) => {
    if (err) throw err;
    let pets = JSON.parse(data);
    callback(pets);
  });
}

if (!validCommands.includes(cmd)) {
  console.error(`Usage: ${node} ${file} [${validCommands.join(' | ')}]`);
  process.exitCode = 1;
} else if (cmd === 'read') {
  readDatabase(db, pets => {
    let readIndex = process.argv[3]; // may be undefined
    if (readIndex) {
      if (readIndex >= 0 && readIndex < pets.length) {
        console.log(pets[readIndex]);
    } else {
        console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
        process.exitCode = 1;
      }
    } else {
      console.log(pets);
    }
  });
} else if (cmd === 'create') {
  let age = process.argv[3] * 1; // convert to number
  let kind = process.argv[4];
  let name = process.argv[5];
  if (!Number.isNaN(age) && kind && name) {
    readDatabase(db, pets => {
      let newPet = {
        age: age,
        kind: kind,
        name: name
      }
      pets.push(newPet);
      fs.writeFile(db, JSON.stringify(pets), (err) => {
        if (err) throw err;
        console.log(newPet);
      })
    });
  } else {
    console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
    process.exitCode = 1;
  }
} else if (cmd === 'update') {
  let index = process.argv[3] * 1;
  let age = process.argv[4] * 1; // convert to number
  let kind = process.argv[5];
  let name = process.argv[6];
  if (!Number.isNaN(index) && !Number.isNaN(age) && kind && name) {
    readDatabase(db, pets => {
      if (index >= 0 && index < pets.length) {
        let updatePet = {
          age: age,
          kind: kind,
          name: name
        }
        pets[index] = updatePet;
        fs.writeFile(db, JSON.stringify(pets), (err) => {
          if (err) throw err;
          console.log(updatePet);
        })
      }
    });
  } else {
    console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
    process.exitCode = 1;
  }
} else if (cmd === 'destroy') {
  let index = process.argv[3];
  if (index) {
    readDatabase(db, pets => {
      if (index >= 0 && index < pets.length) {
        let destroyPet = pets.splice(index, 1);
        fs.writeFile(db, JSON.stringify(pets), (err) => {
          if (err) throw err;
        })
        console.log(destroyPet[0]);
      }
    });
  } else {
    console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
    process.exitCode = 1;
  }
}
