const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/v1/users");
const app = express();
const PORT = 3000;

const corsOption = {
  origin: "http://localhost:3000",
  methods: ["GET, POST, PUT, DELETE"],
};

app.use(cors(corsOption));
app.use(express.json());
app.use("/v1/users", usersRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
