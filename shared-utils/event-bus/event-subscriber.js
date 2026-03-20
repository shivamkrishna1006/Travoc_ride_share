const amqp = require('amqplib');

class EventSubscriber {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.subscribers = {};
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672');
      this.channel = await this.connection.createChannel();
      
      // Set prefetch to 1 for fair distribution
      await this.channel.prefetch(1);
      
      // Declare exchanges
      await this.channel.assertExchange('rides', 'topic', { durable: true });
      await this.channel.assertExchange('drivers', 'topic', { durable: true });
      await this.channel.assertExchange('users', 'topic', { durable: true });

      console.log('✅ Event Subscriber connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Failed to connect Event Subscriber:', error.message);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async subscribe(exchange, topic, handler, serviceName) {
    try {
      // Create unique queue name per service and topic
      const queueName = `${serviceName}.${topic}`;
      
      // Declare queue
      const q = await this.channel.assertQueue(queueName, { durable: true });
      
      // Bind queue to exchange
      await this.channel.bindQueue(q.queue, exchange, topic);

      // Consume messages
      await this.channel.consume(q.queue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            console.log(`📥 Event received: ${content.type} (Queue: ${queueName})`);
            
            // Call the handler
            await handler(content);
            
            // Acknowledge message
            this.channel.ack(msg);
            console.log(`✅ Event processed: ${content.type}`);
          } catch (error) {
            console.error(`❌ Error processing event: ${error.message}`);
            // NACK and requeue if processing fails
            this.channel.nack(msg, false, true);
          }
        }
      });

      console.log(`✅ Subscribed to ${exchange}.${topic} (Queue: ${queueName})`);
    } catch (error) {
      console.error('❌ Error subscribing to event:', error.message);
    }
  }

  async disconnect() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      console.log('✅ Event Subscriber disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error.message);
    }
  }
}

module.exports = new EventSubscriber();
