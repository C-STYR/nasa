const express = require("express");
const cluster = require("cluster");

const app = express();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    //event loop blocked
  }
}


// process.pid is unique to each process
app.get("/", (req, res) => {
  res.send(`Performance example:  ${process.pid}`);
});

app.get("/timer", (req, res) => {
  delay(9000);
  res.send(`ding ding ding: ${process.pid}`);
});

// first expression will only run on the master process
if (cluster.isMaster) {
  console.log("Master has been started");
  // start two child processes
  cluster.fork();
  cluster.fork();
} else {
  console.log("Worker process started");
  // start the server INSIDE the child process
  app.listen(3000);
}

