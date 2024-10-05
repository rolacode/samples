const express = require('express');
const router = express.Router();

const users = []; //simulated database

router.get('/', (req, res) => {
  res.status(200).json(users);
});

router.post('/', (req, res) => {
  const data = req.body;
  const user = {
    id: users.length,
    name: data.name,
    gender: data.gender,
    age: data.age
  };
  users.push(user);
  res.status(201).json({message: 'user created successfully', user});
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  if (id >= users.length) {
    res.status(404).json({message: 'user not found'});
   return;
  }
  const user = req.body;
  users[id] = user;
  res.status(200).json(user);
  return;
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (id >= users.length) {
    res.status(404).json({message: 'user not found'});
   return;
  }
  users.splice(id, 1);
  res.status(200).json({message:'User is deleted successfully'});
});

module.exports = router;