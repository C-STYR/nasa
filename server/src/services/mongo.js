const mongoose = require("mongoose");

require("dotenv").config();
const uri = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established!");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(uri);
}

async function mongoDisconnect() {
  await mongoose.disconnect()
}
module.exports = { mongoConnect, mongoDisconnect };
