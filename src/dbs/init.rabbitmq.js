const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    if (!connection) throw new Error("Connect to rabbitmq fail");
    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (error) {}
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    //publish message to a queue
    const queueName = "test1";
    const message = "test vua publish 1 message";
    await channel.assertQueue(queueName);
    await channel.sendToQueue(queueName, Buffer.from(message));

    //close the connection
    await connection.close();
  } catch (error) {}
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, {
      durable: true,
    });
    console.log("waiting for message ....");
    channel.consume(
      queueName,
      (msg) => {
        console.log("received message :", msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("error publish message to consumer::: ", error);
    throw error;
  }
};

module.exports = { connectToRabbitMQ, connectToRabbitMQForTest, consumerQueue };
