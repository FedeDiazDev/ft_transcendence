import amqp from "amqplib";

export default async function publishUserRegisteredEvent(username) {

	const RABBITMQ_USER = process.env.RABBITMQ_DEFAULT_USER;
	const RABBITMQ_PASS = process.env.RABBITMQ_DEFAULT_PASS;
	const RABBITMQ_HOST = 'rabbitmq';

  const connection = await amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`);
	const channel = await connection.createChannel();
	const queue = "user.registered";

	await channel.assertQueue(queue, { durable: true });

  const message = {
    event: "UserRegistered",
    username: username
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });

  //console.log(" [x] Sent %s", JSON.stringify(message));

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}
