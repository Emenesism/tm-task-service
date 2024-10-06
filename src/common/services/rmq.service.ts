import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib/callback_api';

@Injectable()
export class Amqplibi {
  private readonly queue = 'user-validation-queue';
  private readonly responseQueue = 'task-validation-response-queue';
  private connection: amqp.Connection | null = null;

  constructor() {
    // Establish connection when the service is instantiated
    this.connectToRabbitMQ();
  }

  private connectToRabbitMQ() {
    amqp.connect('amqp://localhost', (error, connection) => {
      if (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        return;
      }
      this.connection = connection;
      console.log('Connected to RabbitMQ');
    });
  }

  public validateJwtWithUserService(jwt: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Request received - Step 2');

      if (!this.connection) {
        return reject(new Error('No RabbitMQ connection established'));
      }

      // Create a new channel for each request
      this.connection.createChannel((error1, channel) => {
        if (error1) {
          console.error('Failed to create channel:', error1);
          return reject(error1);
        }
        console.log('Channel created - Step 4');

        // Assert that both queues exist
        channel.assertQueue(this.queue, { durable: false }, (error2) => {
          if (error2) {
            console.error('Failed to assert user-validation-queue:', error2);
            return reject(error2);
          }
          console.log(`Queue ${this.queue} asserted successfully`);

          // Send JWT to User Service for validation
          const wasSent = channel.sendToQueue(this.queue, Buffer.from(jwt));
          if (wasSent) {
            console.log(`Message sent to ${this.queue} successfully: ${jwt}`);
          } else {
            console.error(`Failed to send message to ${this.queue}`);
            return reject(new Error('Message failed to send to RabbitMQ'));
          }

          // Now, wait for the validation response from the User Service
          channel.assertQueue(
            this.responseQueue,
            { durable: false },
            (error3) => {
              if (error3) {
                console.error(
                  'Failed to assert task-validation-response-queue:',
                  error3,
                );
                return reject(error3);
              }
              console.log(`Queue ${this.responseQueue} asserted successfully`);

              channel.consume(
                this.responseQueue,
                (msg) => {
                  if (msg) {
                    const result = msg.content.toString();
                    console.log(
                      `Received response from User Service: ${result}`,
                    );
                    resolve(result === 'valid'); // Resolve based on the validation result
                  } else {
                    console.error('No message received in the response queue');
                    reject(new Error('No response from User Service'));
                  }

                  // Close the channel after processing the message
                  channel.close((closeError) => {
                    if (closeError) {
                      console.error('Failed to close channel:', closeError);
                    } else {
                      console.log('Channel closed successfully');
                    }
                  });
                },
                { noAck: true },
              );
            },
          );
        });
      });
    });
  }
}
