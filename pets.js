'use strict';

const fs = require('fs');
const path = require('path');
const db = path.join(__dirname, 'pets.json');

const validCommands = ['create', 'read', 'update', 'destroy'];

let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);
let cmd = process.argv[2];

if (!validCommands.includes(cmd)) {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exitCode = 1;
} else if (cmd === 'read') {
  fs.readFile(db, (err, data) => {
    if (err) throw err;
    let pets = JSON.parse(data);
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
} else if (cmd = 'create') {
  let age = process.argv[3] * 1; // convert to number
  let kind = process.argv[4];
  let name = process.argv[5];
  if (!Number.isNaN(age) && kind && name) {
    fs.readFile(db, (err, data) => {
      if (err) throw err;
      let pets = JSON.parse(data);
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
}
