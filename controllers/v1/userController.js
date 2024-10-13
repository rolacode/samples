const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

//loads the enviromental variables from the .env file
dotenv.config();

// @desc POST Create a new user
// @route POST /v1/users
// @access public
const createUserHandler = async (req, res) => {
  try {
    let { name, gender, age, email, password } = req.body;
    const lowerCasegender = gender.toLowerCase();

    if (typeof name !== "string") {
      res.status(400).json({
        message: "name must be string",
      });
      return;
    }

    if (typeof gender !== "string") {
      res.status(400).json({
        message: "gender must be string",
      });
      return;
    } else if (lowerCasegender !== "male" && lowerCasegender !== "female") {
      res.status(400).json({
        message: "gender must be either male or female",
      });
      return;
    }

    if (typeof age !== "number") {
      res.status(400).json({
        message: "age must be number",
      });
      return;
    } else if (age < 15) {
      res.status(400).json({
        message: "age must be 15 years and above",
      });
      return;
    }

    if (typeof email !== "string") {
      res.status(400).json({
        message: "email must be string",
      });
      return;
    } else if (!email.includes("@")) {
      res.status(400).json({
        message: "Enter vaild email",
      });
    }

    if (typeof password !== "string") {
      res.status(400).json({
        message: "password must be string",
      });
      return;
    } else if (password.length < 8) {
      res.status(400).json({
        message: "password must not less than 8 characters",
      });
      return;
    }

    const hasedPassword = await bcrypt.hash(password, 10);
    const user = User.build({
      name: name,
      gender: lowerCasegender,
      age: age,
      email: email,
      password: hasedPassword,
    });
    await user.save();
    res.status(201).json({
      message: "user created successfully",
      user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "error message",
    });
  }
};

// @desc GET Retrieve a new user
// @route GET /v1/users
// @access public
const getUsersHandler = async (req, res) => {
  try {
    const users = await User.findAll({});
    res.status(200).json(users);
    return;
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc GET Retrieve a new user
// @route GET /v1/users/:id
// @access public
const getUserHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (typeof id !== "number" || isNaN(id)) {
      res.status(400).json({
        message: "Id must be a Number",
      });
      return;
    }
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "User Not Found",
      });
      return;
    }
    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(500).json({
      message: "error message",
    });
  }
};

// @desc PUT Update new user
// @route PUT /v1/users/:id
//@access public
const updateUserHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    let { name, gender, age, email } = req.body;
    const lowerCasegender = gender.toLowerCase();

    if (typeof id !== "number" || isNaN(id)) {
      res.status(400).json({
        message: "Id must be a Number",
      });
      return;
    }

    if (typeof name !== "string") {
      res.status(400).json({
        message: "name must be string",
      });
      return;
    }

    if (typeof gender !== "string") {
      res.status(400).json({
        message: "gender must be string",
      });
      return;
    } else if (lowerCasegender !== "male" && lowerCasegender !== "female") {
      res.status(400).json({
        message: "gender must be either male or female",
      });
      return;
    }

    if (typeof age !== "number") {
      res.status(400).json({
        message: "age must be number",
      });
      return;
    } else if (age < 15) {
      res.status(400).json({
        message: "age must be 15 years and above",
      });
      return;
    }

    if (typeof email !== "string") {
      res.status(400).json({
        message: "email must be string",
      });
      return;
    } else if (!email.includes("@")) {
      res.status(400).json({
        message: "Enter vaild email",
      });
    }

    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "User Not Found",
      });
      return;
    }
    user.name = name;
    user.gender = lowerCasegender;
    user.age = age;
    user.email = email;
    await user.update();
    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(500).json({
      message: "error message",
    });
  }
};

// @desc DELETE Remove a user
// @route DELETE /v1/users/:id
// @access public
const deleteUserHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (typeof id !== "number" || isNaN(id)) {
      res.status(400).json({
        message: "Id must be a Number",
      });
      return;
    }

    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "User Not Found",
      });
      return;
    }

    await user.destroy();
    res.status(200).json({
      message: "user Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "error message",
    });
  }
};

// @desc POST Login user
// @route POST /v1/users/login
// @access public
const loginUserHandler = async (req, res) => {
  const { email, password } = req.body;
  const SECRET_KEY = process.env.JWT_SECRET_KEY;

  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    res.status(404).json({ message: 'User is not exist' });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ message: 'Invalid Password' });
    return;
  }
  const payload = { id: user.id, email: user.email, };

  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

  res.status(200).json({ accessToken, refreshToken });
  return;
};

module.exports = {
  createUserHandler,
  getUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
  loginUserHandler,
};
