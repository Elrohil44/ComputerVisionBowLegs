const assert = require('assert');
const { Producer, AdminClient } = require('node-rdkafka');

const { KAFKA_BROKER } = process.env;
const TOPIC = 'bow-legs-jobs';
const NUMBER_OF_PARTITIONS = 3;

assert(KAFKA_BROKER, 'Missing Kafka broker URL');

const kafkaAdminClient = AdminClient.create({
  'client.id': 'kafka-admin',
  'metadata.broker.list': KAFKA_BROKER,
});


kafkaAdminClient.createPartitions(TOPIC, NUMBER_OF_PARTITIONS, () => {
  console.log(`Successfully set the number of partitions to ${NUMBER_OF_PARTITIONS} for topic ${TOPIC}`);
});

const producer = new Producer({
  'metadata.broker.list': KAFKA_BROKER,
});

producer.connect({}, (error) => {
  if (!error) {
    producer.setPollInterval(1000);
  }
});

const publishMessage = async (message) => {
  await new Promise((resolve, reject) => {
    producer.connect({}, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    return producer.produce(TOPIC, -1, Buffer.from(message));
  });
};

module.exports = {
  publishMessage,
};
