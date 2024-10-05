const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const app = express();
const PORT = 4000;

const corsOption = {
  origin: 'http://localhost:4000',
  methods: ['GET, POST, PUT, DELETE'],
}

app.use(cors(corsOption));
app.use(express.json());
app.use('/v1/users', usersRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});