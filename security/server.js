const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')


require('dotenv').config()

const PORT = 3000;

const config = {
    CLIENT_ID: process.env.CLIENT_ID, 
    CLIENT_SECRET: process.env.CLIENT_SECRET 
}

passport.use(new Strategy({}))

const app = express();

app.use(helmet());
app.use(passport.initialize())

function checkLoggedIn(req, res, next) {
  const isLoggedIn = true; /* some validation here */
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in!",
    });
  }
  next();
}

app.get("/auth/google", (req, res) => {});

app.get("/auth/google/callback", (req, res) => {}); // this is set in our Oauth credentials in google

app.get("/auth/login", (req, res) => {}); 



app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("your secret value is 42");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  ) //second arg is the app
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
