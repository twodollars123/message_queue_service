const { consumerQueue, connectToRabbitMQ } = require("../dbs/init.rabbitmq");
const NotificationRepo = require("../repos/notification.repo");

// const log = console.log;
// console.log = function () {
//   log.apply(console, [new Date()].concat(arguments));
// };

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

      // const expiredTime = 4000;
      // setTimeout(() => {
      channel.consume(notiQueue, async (msg) => {
        try {
          /**
           * logic va neu throw de vao catch
           */
          console.log(
            `send notification successfully ::`,
            JSON.parse(msg.content)
          );
          const { newNotiId } = JSON.parse(msg.content);
          console.log("newNotiId::", newNotiId);
          //found noti inner join noti_type
          const foundNoti = await NotificationRepo.findOne(newNotiId);
          console.log("foundNoti", foundNoti);
          if (!foundNoti) throw new Error("khong tin thay noti");
          let received_id = -1;
          //check type
          if (foundNoti.noti_typeid === 1) {
            //send to all user
            received_id = -1;
          }
          // else {
          //   // tim nhung user dang ki nhan thoong baos
          // }
          const createdNewNoti = await NotificationRepo.createOne(
            newNotiId,
            received_id
          );
          console.log("createdNewNoti", createdNewNoti);
          if (!createdNewNoti) throw new Error("created noti-receive fail");
          console.log("createNew:::", createdNewNoti);
          channel.ack(msg);
        } catch (error) {
          // console.error("send fail", error);
          console.log("err:::", error);
          channel.nack(msg, false, false);
        }
      });
      // }, expiredTime);
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
      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            `this notification error, pls hot fix ::`,
            msgFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(error);
      // throw error;
    }
  },
};

module.exports = messageService;
