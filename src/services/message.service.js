const { consumerQueue, connectToRabbitMQ } = require("../dbs/init.rabbitmq");

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error("err::", error);
    }
  },

  //case processing
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notiQueue = "notificationQueueProcess"; //assertQueue

      const expiredTime = 15000;
      setTimeout(() => {
        channel.consume(notiQueue, (msg) => {
          console.log(
            `send notification successfully ::`,
            msg.content.toString()
          );
          channel.ack(msg);
        });
      }, expiredTime);
    } catch (error) {
      console.error(error);
    }
  },

  //case failed processing
  consumerToQueueFailed: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationExchageDLX = "notificationExDLX"; //notificationEx direct
      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; //assert
      const notiQueueHandler = "notificationQueueHotFix";

      await channel.assertExchange(notificationExchageDLX, "direct", {
        durable: true,
      });
      //2. create queue
      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false, //cho phep cac ket noi truy cap cung mot luc hang doi
      });
      //3. bindQueue
      await channel.bindQueue(
        queueResult.queue,
        notificationExchageDLX,
        notificationRoutingKeyDLX
      );
      channel.consume(queueResult.queue, (msgFailed) => {
        console.log(
          `this notification error, pls hot fix ::`,
          msgFailed.content.toString()
        );
        channel.ack(msgFailed);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = messageService;
