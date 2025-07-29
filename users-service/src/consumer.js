import amqp from 'amqplib';
import fs from 'fs';
import dotenv from "dotenv";

function registerUserInDatabase(username, db){

	// Read the avatar file as a binary blob
	const avatarBlob = fs.readFileSync("/data/pics/defaultAvatar.png");

	const query = db.prepare("INSERT INTO users (username, avatar_blob, presentacion) VALUES (?, ?, ?)");
	query.run(username,  avatarBlob, "Hi! I'm a new user, how are you doing?");
	console.log("User created in database");
}

export default async function consumeUserRegisteredEvent(db) {
	const RABBITMQ_USER = process.env.RABBITMQ_DEFAULT_USER;
	const RABBITMQ_PASS = process.env.RABBITMQ_DEFAULT_PASS;
	const RABBITMQ_HOST = 'rabbitmq';

    const connection = await amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}`);
    const channel = await connection.createChannel();
    const queue = 'user.registered';

    await channel.assertQueue(queue, { durable: true });
    console.log(' [*] Waiting for messages in %s', queue);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        console.log('Received message:', message);

        if (message.event === 'UserRegistered') {
          await registerUserInDatabase(message.username, db);
        }

       channel.ack(msg);
     }
   });
}
