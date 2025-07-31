import amqp from "amqplib";
import dotenv from "dotenv";
import { saveGameAndUpdateElo } from '../components/postGame.js'; // adjust path as needed

export default async function consumeGameResultEvents(server) {
  const db = server.db;
  const RABBITMQ_USER = process.env.RABBITMQ_DEFAULT_USER;
  const RABBITMQ_PASS = process.env.RABBITMQ_DEFAULT_PASS;
  const RABBITMQ_HOST = 'rabbitmq';

  const connection = await amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`);
  const channel = await connection.createChannel();
  const queue = "game.result";

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const gameResult = JSON.parse(msg.content.toString());
        console.log(" [x] Received game result:", gameResult);

        // Save game result and update ELO with real usernames
        await saveGameAndUpdateElo(db, gameResult);

        channel.ack(msg);
      } catch (error) {
        console.error("Error processing game result event:", error);
      }
    }
  });
}
