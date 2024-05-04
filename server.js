const {
  consumerToQueue,
  consumerToQueueNormal,
  consumerToQueueFailed,
} = require("./src/services/message.service");

const queueName = "test1";

//init db
require("./src/dbs/init.postgres.lv0")
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

// consumerToQueue(queueName)
//   .then(() => {
//     console.log(`message consumer started ${queueName}`);
//   })
//   .catch((err) => {
//     console.error(`message err ::: `, err.message);
//   });

consumerToQueueNormal(queueName)
  .then(() => {
    console.log(`message consumerToQueueNormal started`);
  })
  .catch((err) => {
    console.error(`message err ::: `, err.message);
  });

consumerToQueueFailed(queueName)
  .then(() => {
    console.log(`message consumerToQueueFailed started`);
  })
  .catch((err) => {
    console.error(`message err ::: `, err.message);
  });
