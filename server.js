const express = require('express');
 const usersRouter = require('./routes/users');
const app = express();
const PORT = 4000;

app.use(express.json());
app.use('/v1/users', usersRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});