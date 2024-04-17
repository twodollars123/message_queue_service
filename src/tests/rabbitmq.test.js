const { connectToRabbitMQForTest } = require("../dbs/init.rabbitmq");

describe("RabbitMQ Connection Test", () => {
  it("should connect to successful RabbitMQ", async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});
