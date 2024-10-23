const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const combineRoute = require("./routes/combineRoute");
const createRoute = require("./routes/createRoute");
const evaluateRoute = require("./routes/evaluateRoute");
const updateAndDeleteRoute = require("./routes/updateAndDeleteRoute");
const { MongoClient, ObjectId } = require("mongodb");
app.use(cors());
dotenv.config();
app.use(express.json());

const url = process.env.url;
const client = new MongoClient(url);
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });



app.use("/api", createRoute);

app.use("/api", combineRoute);

app.use("/api", evaluateRoute);

app.use("/api", updateAndDeleteRoute);

app.listen(process.env.port, () => {
  console.log(`app listening at http://localhost:${process.env.port}`);
});
