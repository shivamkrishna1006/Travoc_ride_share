const amqp = require('amqplib');

class EventPublisher {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.connected = false;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672');
      this.channel = await this.connection.createChannel();
      
      // Declare exchanges with durable flag
      await this.channel.assertExchange('rides', 'topic', { durable: true });
      await this.channel.assertExchange('drivers', 'topic', { durable: true });
      await this.channel.assertExchange('users', 'topic', { durable: true });
      
      this.connected = true;
      console.log('✅ Event Publisher connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Failed to connect Event Publisher:', error.message);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async publish(eventType, data) {
    if (!this.connected || !this.channel) {
      console.error('⚠️  Event Publisher not connected, buffering event:', eventType);
      return;
    }

    const event = {
      type: eventType,
      data,
      timestamp: new Date(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      // Determine exchange based on event type
      let exchange = 'rides';
      let topic = eventType.toLowerCase();

      if (eventType.startsWith('Driver')) {
        exchange = 'drivers';
      } else if (eventType.startsWith('User')) {
        exchange = 'users';
      }

      // Publish with persistent flag
      this.channel.publish(
        exchange,
        topic,
        Buffer.from(JSON.stringify(event)),
        { persistent: true, contentType: 'application/json' }
      );

      console.log(`📤 Event published: ${eventType} (ID: ${event.id})`);
      return event.id;
    } catch (error) {
      console.error('❌ Error publishing event:', error.message);
    }
  }

  async disconnect() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      this.connected = false;
      console.log('✅ Event Publisher disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error.message);
    }
  }
}

module.exports = new EventPublisher();
