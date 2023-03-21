const { Worker, workerData, isMainThread } = require("worker_threads");

// demonstrating we're in the same process
if (isMainThread) {
  console.log(`Main Thread! Process ID: ${process.pid}`);
  // __filename is the current file
  new Worker(__filename, {
    workerData: [7, 6, 2, 3],
  });
  new Worker(__filename, {
    workerData: [2, 5, 6, 2],
  });
} else {
  console.log(`Worker! Process ID: ${process.pid}`);
  console.log(`${workerData} sorted is ${workerData.sort()}`)
}
