const http = require("http");
const mongoose = require("mongoose");
require('dotenv').config()
const uri = process.env.MONGO_URL

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established!");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});


async function startServer() {
  await mongoose.connect(uri);

  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}
startServer();
