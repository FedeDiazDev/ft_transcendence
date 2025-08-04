import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

export default async function publishGameResultEvent(gameResult) {
  const RABBITMQ_USER = process.env.RABBITMQ_DEFAULT_USER;
  const RABBITMQ_PASS = process.env.RABBITMQ_DEFAULT_PASS;
  const RABBITMQ_HOST = 'rabbitmq';

  const connection = await amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`);
  const channel = await connection.createChannel();
  const queue = "game.result";

  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(gameResult)), { persistent: true });

  //console.log(" [x] Sent game result:", gameResult);

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}
