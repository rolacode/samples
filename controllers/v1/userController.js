const express = require('express');

const users = []; //stimulating database

// @desc POST Create a new user
// @route POST /v1/users
// @access public
const createUserHandler = async (req, res) => {
  try {
    let { name, gender, age} = req.body;
    const lowerCaseGender = gender.toLowerCase();

    if (typeof name !== 'string') {
      res.status(400).json({message: 'name must be string'});
      return;
    }

    if (typeof gender !== 'string') {
      res.status(400).json({message: 'gender must be string'});
      return;
    } else if (lowerCaseGender !== 'male' && lowerCaseGender !== 'female') {
      res.status(400).json({message: 'gender must be either male or female'});
      return;
    }

    if (typeof age !== 'number') {
      res.status(400).json({message: 'age must be number'});
      return;
    } else if(age < 15) {
      res.status(400).json({message: 'age must be 15 years and above'});
      return;
    }

    const user = {
      id: users.length,
      name: name,
      gender: lowerCaseGender,
      age: age
    };
    users.push(user);
    res.status(201).json({message: 'user created successfully', user});
    return;
  } catch (error) {
    res.status(500).json({message: 'error message'});
  }  
};

// @desc GET Retrieve a new user
// @route GET /v1/users/:id
// @access public
const getUserHandler = async (req, res) => {
  try {
    res.status(200).json(users);
    return;
  } catch (error) {
    res.status(500).json({message: 'error message'});
  }
};

// @desc PUT Update new user
// @route PUT /v1/users/:id
// @access public
const updateUserHandler = async (req, res) => {

};


// @desc DELETE Remove a user
// @route DELETE /v1/users/:id
// @access public
const deleteUserHandler = async (req, res) => {
  try {
    const id = req.params.id;
    if (id >= users.length) {
      res.status(404).json({message: 'user not exist'});
      return;
    }
    users.splice(id, 1);
    res.status(200).json({message: 'user Deleted successfully'});
  } catch (error) {
    res.status(500).json({message: 'error message'});
  }
};

module.exports = {
  createUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler
}